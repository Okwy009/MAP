import { createProfileRepository } from "@/repositories/profile.repository";
import { computeCompletion } from "@/services/onboarding/completion";
import { createClient } from "@/lib/supabase/server";

const TALLY_FORM_URL = "https://tally.so/forms/zxjJMR";

/**
 * Persistent, non-blocking onboarding nudge (FR1/FR2) — reads the profile
 * directly rather than round-tripping through GET /api/profile/completion,
 * same pattern as app/page.tsx's own greeting. Never rendered for a
 * `migrated_from_manual` creator (FR9 — they're reached by email instead).
 */
export async function OnboardingChecklist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profiles = createProfileRepository(supabase);
  const profile = await profiles.getProfile(user.id);
  if (!profile || profile.migratedFromManual) return null;

  const { percent, missingFields, isComplete } = computeCompletion(profile);

  if (isComplete) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        ✓ Profile complete
      </div>
    );
  }

  const preview = missingFields.slice(0, 3).join(", ");
  const rest = missingFields.length > 3 ? `, +${missingFields.length - 3} more` : "";

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Profile {percent}% complete</span>
        <a
          href={TALLY_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-primary hover:underline"
        >
          Complete your profile
        </a>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Missing: {preview}
        {rest}
      </p>
    </div>
  );
}
