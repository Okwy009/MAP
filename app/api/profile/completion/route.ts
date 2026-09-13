import { NextResponse } from "next/server";

import { createProfileRepository } from "@/repositories/profile.repository";
import { computeCompletion } from "@/services/onboarding/completion";
import { createClient } from "@/lib/supabase/server";

/** GET /api/profile/completion — completion percentage + missing fields, for the checklist widget (IP-0005 task 6). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const profiles = createProfileRepository(supabase);
  const profile = await profiles.getProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }

  return NextResponse.json(computeCompletion(profile));
}
