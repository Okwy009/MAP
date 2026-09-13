import type { Profile } from "@/types/profile";

interface TrackedField {
  key: keyof Profile;
  label: string;
  /**
   * Whether this field blocks `onboarding_complete` from flipping true when
   * missing. Excluded fields have no live write path from the Tally webhook,
   * so requiring them would make `onboarding_complete` permanently
   * unreachable:
   *  - `newsletter_days` — conditional (only relevant for weekly cadence),
   *    no Tally key mapped to it yet (see tally-domain-service.ts).
   *  - `publishing_cadence` — MAP-003's original field, superseded by the
   *    more granular `posting_frequency_type` + `posting_frequency_count`
   *    pair once the real Tally form was inspected. Confirmed superseded,
   *    not just unmapped: PRD-0005's Data Requirements lists exactly which
   *    MAP-003 fields were "reused as-is" by the Tally mapping, and
   *    `publishing_cadence` is deliberately not among them. Still settable
   *    via PATCH /api/profile directly, so still tracked for the
   *    percentage — just doesn't gate completion.
   */
  requiredForComplete: boolean;
}

// MAP-003's original 9 context fields, plus MAP-004's 9 new ones
// (newsletter_consent excluded — NOT NULL DEFAULT false, so it's always
// "filled" and would be meaningless as a completion signal).
const TRACKED_FIELDS: TrackedField[] = [
  { key: "creatorType", label: "Creator type", requiredForComplete: true },
  { key: "platform", label: "Platform", requiredForComplete: true },
  { key: "audience", label: "Audience", requiredForComplete: true },
  { key: "focusArea", label: "Content focus", requiredForComplete: true },
  { key: "tone", label: "Tone", requiredForComplete: true },
  { key: "publishingCadence", label: "Publishing cadence", requiredForComplete: false },
  { key: "primaryGoal", label: "Primary goal", requiredForComplete: true },
  { key: "aiPreference", label: "AI assistance preference", requiredForComplete: true },
  { key: "reviewCadence", label: "Review cadence", requiredForComplete: true },
  { key: "subscriberCount", label: "Subscriber count", requiredForComplete: true },
  { key: "priorityPlatform", label: "Priority platform", requiredForComplete: true },
  { key: "profileLink", label: "Profile link", requiredForComplete: true },
  { key: "postingFrequencyType", label: "Posting frequency", requiredForComplete: true },
  { key: "postingFrequencyCount", label: "Posting frequency count", requiredForComplete: true },
  { key: "newsletterCadence", label: "Newsletter cadence", requiredForComplete: true },
  { key: "newsletterDays", label: "Newsletter days", requiredForComplete: false },
  { key: "startDate", label: "Start date", requiredForComplete: true },
  { key: "desiredImpact", label: "Desired impact", requiredForComplete: true },
];

export interface CompletionResult {
  percent: number;
  missingFields: string[];
  isComplete: boolean;
}

/**
 * Shared by GET /api/profile/completion (checklist UI) and the Tally webhook
 * (to decide when to flip onboarding_complete) so the two can't disagree
 * about what "complete" means.
 */
export function computeCompletion(profile: Profile): CompletionResult {
  const missing = TRACKED_FIELDS.filter((f) => profile[f.key] == null);
  const filledCount = TRACKED_FIELDS.length - missing.length;
  const missingRequired = missing.filter((f) => f.requiredForComplete);

  return {
    percent: Math.round((filledCount / TRACKED_FIELDS.length) * 100),
    missingFields: missing.map((f) => f.label),
    isComplete: missingRequired.length === 0,
  };
}
