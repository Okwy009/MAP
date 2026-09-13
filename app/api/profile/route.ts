import { NextResponse } from "next/server";
import { z } from "zod";

import { ProfileConflictError, createProfileRepository } from "@/repositories/profile.repository";
import { createClient } from "@/lib/supabase/server";

const updateProfileSchema = z
  .object({
    fullName: z.string().min(1).nullable(),
    username: z.string().min(3).nullable(),
    avatarUrl: z.string().nullable(),
    website: z.string().nullable(),
    focusArea: z.string().nullable(),
    creatorType: z.string().nullable(),
    platform: z.string().nullable(),
    audience: z.string().nullable(),
    tone: z.string().nullable(),
    publishingCadence: z.string().nullable(),
    primaryGoal: z.string().nullable(),
    aiPreference: z.boolean().nullable(),
    reviewCadence: z.string().nullable(),
    onboardingComplete: z.boolean(),
  })
  .partial();

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** GET /api/profile — the caller's own full profile (PRD-0004 FR3). */
export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const profiles = createProfileRepository(supabase);
  const profile = await profiles.getProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }
  return NextResponse.json(profile);
}

/**
 * PATCH /api/profile — updates only the fields present in the body
 * (PRD-0004 FR2; partial-update semantics from the edge case: omitted fields
 * are left untouched, not nulled).
 */
export async function PATCH(request: Request) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const profiles = createProfileRepository(supabase);
  try {
    const updated = await profiles.updateProfile(user.id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ProfileConflictError) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }
    console.error("[profile PATCH] failed", error);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
