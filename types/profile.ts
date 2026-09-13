export interface Profile {
  id: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  website: string | null;
  /** Set once, by the MAP-001 migration script. Never client-writable. */
  migratedFromManual: boolean;
  /** Content focus. Added in 000002; doubles as MAP-003's "topics" field (Founder decision, 2026-09-12). */
  focusArea: string | null;
  creatorType: string | null;
  platform: string | null;
  audience: string | null;
  tone: string | null;
  publishingCadence: string | null;
  primaryGoal: string | null;
  /** The real Tally form only offers Yes/No (000006: text -> boolean). */
  aiPreference: boolean | null;
  reviewCadence: string | null;
  onboardingComplete: boolean;

  // --- MAP-004 / 000006 (PRD-0005) ---
  subscriberCount: number | null;
  priorityPlatform: string | null;
  profileLink: string | null;
  postingFrequencyType: string | null;
  postingFrequencyCount: number | null;
  newsletterCadence: string | null;
  /** Conditional field (only relevant for weekly cadence). Not currently populated by the Tally webhook — see services/onboarding/README.md. */
  newsletterDays: string | null;
  startDate: string | null;
  desiredImpact: string | null;
  newsletterConsent: boolean;
}

/**
 * Fields settable via `profile.repository.ts`'s `updateProfile`. `id` and
 * `migratedFromManual` are never writable — deliberately absent here.
 *
 * Two distinct callers use this, with different intent:
 *  - `PATCH /api/profile` (MAP-003): true partial update — a field omitted
 *    from the request body is left untouched.
 *  - `POST /api/webhooks/tally` (MAP-004): per FR7, a resubmission
 *    *overwrites* previous answers — it includes (and nulls out) every
 *    field the form covers, deliberately, not just changed ones.
 * `updateProfile` itself stays a dumb partial-updater either way: it only
 * ever touches keys actually present on the object it's given.
 */
export interface UpdateProfileInput {
  fullName?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
  focusArea?: string | null;
  creatorType?: string | null;
  platform?: string | null;
  audience?: string | null;
  tone?: string | null;
  publishingCadence?: string | null;
  primaryGoal?: string | null;
  aiPreference?: boolean | null;
  reviewCadence?: string | null;
  onboardingComplete?: boolean;

  subscriberCount?: number | null;
  priorityPlatform?: string | null;
  profileLink?: string | null;
  postingFrequencyType?: string | null;
  postingFrequencyCount?: number | null;
  newsletterCadence?: string | null;
  newsletterDays?: string | null;
  startDate?: string | null;
  desiredImpact?: string | null;
  /** NOT NULL DEFAULT false at the DB level — never set this to null; omit the key instead. */
  newsletterConsent?: boolean;
}
