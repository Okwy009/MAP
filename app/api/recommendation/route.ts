import { NextResponse } from "next/server";

import { matchRule } from "@/services/decision-engine/engine";
import { createProfileRepository } from "@/repositories/profile.repository";
import { createClient } from "@/lib/supabase/server";

/** GET /api/recommendation — the caller's single recommendation (FR6). No caching; regenerated fresh each call, per IP-0006. */
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

  const rule = matchRule(profile);
  console.info(`[recommendation] creator=${user.id} rule=${rule.id}`);
  return NextResponse.json(rule.generate(profile));
}
