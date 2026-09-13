import type { TallyWebhookPayload } from "@/types/onboarding";

/**
 * FR4 fallback verification: `formId` match only. No cryptographic signature
 * — investigated directly against the live Tally integration and found
 * unavailable on the current plan (PRD-0005 FR4). Deliberately a lower trust
 * bar than Gumroad's webhook; acceptable because onboarding data carries no
 * financial risk (worst case of a forged submission is bad profile data, not
 * fraud).
 */
export function verifyTallyForm(payload: TallyWebhookPayload): boolean {
  const expected = process.env.TALLY_FORM_ID;
  if (!expected) {
    throw new Error("TALLY_FORM_ID is not set");
  }
  return payload?.data?.formId === expected;
}
