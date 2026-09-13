import type { TallyField } from "@/types/onboarding";
import type { UpdateProfileInput } from "@/types/profile";

const NOT_APPLICABLE = "n/a";

function fieldByKey(fields: TallyField[], key: string): TallyField | undefined {
  return fields.find((f) => f.key === key);
}

/**
 * Resolves a field to display text: option ID(s) -> label(s) via `options`
 * when present (joining multiple selections with ", "), else the raw value.
 * A literal "n/a" (Tally's marker for a conditionally-skipped question)
 * resolves to null, same as truly empty.
 */
function resolveText(field: TallyField | undefined): string | null {
  if (!field || field.value == null) return null;

  if (field.options) {
    const ids = Array.isArray(field.value) ? field.value : [field.value];
    const labels = ids
      .map((id) => field.options?.find((o) => o.id === id)?.text)
      .filter((t): t is string => Boolean(t));
    if (labels.length === 0) return null;
    const joined = labels.join(", ");
    return joined.trim().toLowerCase() === NOT_APPLICABLE ? null : joined;
  }

  const raw = typeof field.value === "string" ? field.value : String(field.value);
  const trimmed = raw.trim();
  return trimmed.length === 0 || trimmed.toLowerCase() === NOT_APPLICABLE ? null : trimmed;
}

function resolveInt(field: TallyField | undefined): number | null {
  const text = resolveText(field);
  if (text == null) return null;
  const n = Number.parseInt(text, 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Yes/No question -> boolean, distinguishing "answered No" (false) from
 * "not answered at all" (null) — collapsing both to false would silently
 * misrepresent a skipped question as a negative answer.
 */
function resolveYesNo(field: TallyField | undefined, yesText: string): boolean | null {
  if (!field || !field.options || !Array.isArray(field.value) || field.value.length === 0) {
    return null;
  }
  const yesOption = field.options.find((o) => o.text === yesText);
  if (!yesOption) return null;
  return field.value.includes(yesOption.id);
}

export interface MappedSubmission {
  /** From question_zDVXPk — used only to match a MAP creator, never stored. */
  email: string | null;
  fields: UpdateProfileInput;
}

/**
 * Pure mapping: raw Tally fields -> profile update input. No I/O. Field keys
 * per IP-0005's confirmed mapping table (see README.md for the full table and
 * one known gap: `newsletter_days` has no mapped key and is never populated
 * here).
 *
 * Per FR7, a resubmission *overwrites* previous answers — every field below
 * is included (and nulled if unanswered/"n/a"), not just ones that changed.
 * `newsletter_consent` is the one exception: it's NOT NULL at the DB level,
 * so it's only included when actually answered (never set to explicit null).
 */
export function mapTallySubmission(rawFields: TallyField[]): MappedSubmission {
  const firstName = resolveText(fieldByKey(rawFields, "question_8Q9o7l"));
  const lastName = resolveText(fieldByKey(rawFields, "question_064rN9"));
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  const email = resolveText(fieldByKey(rawFields, "question_zDVXPk"));

  const fields: UpdateProfileInput = {
    fullName,
    creatorType: resolveText(fieldByKey(rawFields, "question_XWj5BO")),
    subscriberCount: resolveInt(fieldByKey(rawFields, "question_P0GXL0")),
    platform: resolveText(fieldByKey(rawFields, "question_8Q9NpA")),
    priorityPlatform: resolveText(fieldByKey(rawFields, "question_064VjZ")),
    profileLink: resolveText(fieldByKey(rawFields, "question_lWlOLo")),
    focusArea: resolveText(fieldByKey(rawFields, "question_zDVEQ1")),
    audience: resolveText(fieldByKey(rawFields, "question_51NXqM")),
    primaryGoal: resolveText(fieldByKey(rawFields, "question_DdLqvb")),
    postingFrequencyType: resolveText(fieldByKey(rawFields, "question_P5oRBQ")),
    postingFrequencyCount: resolveInt(fieldByKey(rawFields, "question_ze1QVZ")),
    newsletterCadence: resolveText(fieldByKey(rawFields, "question_rEkdRL")),
    aiPreference: resolveYesNo(fieldByKey(rawFields, "question_xZl0Yy"), "Yes"),
    startDate: resolveText(fieldByKey(rawFields, "question_xyNJpG")),
    tone: resolveText(fieldByKey(rawFields, "question_lNPB0B")),
    reviewCadence: resolveText(fieldByKey(rawFields, "question_R5OWBp")),
    desiredImpact: resolveText(fieldByKey(rawFields, "question_oMJ9VX")),
  };

  const newsletterConsent = resolveYesNo(fieldByKey(rawFields, "question_GdMeB2"), "Yes (Share)");
  if (newsletterConsent !== null) {
    fields.newsletterConsent = newsletterConsent;
  }

  return { email, fields };
}
