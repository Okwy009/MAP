import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/service";
import { createCreatorRepository } from "@/repositories/creator.repository";
import { createProcessedTallySubmissionRepository } from "@/repositories/processed-tally-submission.repository";
import { createProfileRepository } from "@/repositories/profile.repository";
import { computeCompletion } from "@/services/onboarding/completion";
import { mapTallySubmission } from "@/services/onboarding/tally-domain-service";
import { verifyTallyForm } from "@/services/onboarding/tally-verify";
import type { TallyWebhookPayload } from "@/types/onboarding";

/**
 * Tally onboarding-form webhook receiver (IP-0005 task 4).
 *
 * Unauthenticated by nature (Tally, not a MAP session). Verified by formId
 * match only (FR4 — see tally-verify.ts for why). Returns 200 for anything
 * well-formed Tally shouldn't retry; non-2xx only for a malformed request or
 * an unexpected error we want retried (Tally retries at 5min/30min/1hr/6hr/1day).
 */
export async function POST(request: Request) {
  let payload: TallyWebhookPayload;
  try {
    payload = (await request.json()) as TallyWebhookPayload;
  } catch {
    return new NextResponse("malformed body", { status: 400 });
  }

  const submissionId = payload?.data?.submissionId;
  if (!submissionId) {
    console.warn("[tally-webhook] rejected: missing submissionId");
    return new NextResponse("missing submissionId", { status: 400 });
  }

  try {
    if (!verifyTallyForm(payload)) {
      console.warn(
        `[tally-webhook] submission=${submissionId} outcome=rejected reason=form_id_mismatch`
      );
      return NextResponse.json({ outcome: "rejected", reason: "form_id_mismatch" });
    }

    const supabase = createServiceRoleClient();
    const processedSubmissions = createProcessedTallySubmissionRepository(supabase);

    if (await processedSubmissions.has(submissionId)) {
      console.info(`[tally-webhook] submission=${submissionId} outcome=duplicate`);
      return NextResponse.json({ outcome: "duplicate" });
    }

    const { email, fields } = mapTallySubmission(payload.data.fields ?? []);
    if (!email) {
      console.warn(`[tally-webhook] submission=${submissionId} outcome=rejected reason=no_email`);
      return NextResponse.json({ outcome: "rejected", reason: "no_email" });
    }

    const creators = createCreatorRepository(supabase);
    const creatorId = await creators.findIdByEmail(email);
    if (!creatorId) {
      // PRD-0005 edge case: submission doesn't match any MAP account. Don't
      // record it — leave replayable once the mismatch is resolved.
      console.warn(
        `[tally-webhook] submission=${submissionId} outcome=rejected reason=no_matching_account`
      );
      return NextResponse.json({ outcome: "rejected", reason: "no_matching_account" });
    }

    const profiles = createProfileRepository(supabase);
    const updated = await profiles.updateProfile(creatorId, fields);

    // Task 8: flip onboarding_complete once every required field is filled.
    const { isComplete } = computeCompletion(updated);
    if (isComplete && !updated.onboardingComplete) {
      await profiles.updateProfile(creatorId, { onboardingComplete: true });
    }

    await processedSubmissions.record(submissionId);

    console.info(
      `[tally-webhook] submission=${submissionId} outcome=processed creator=${creatorId}`
    );
    return NextResponse.json({ outcome: "processed" });
  } catch (error) {
    console.error(`[tally-webhook] submission=${submissionId} processing error`, error);
    return new NextResponse("processing error", { status: 500 });
  }
}
