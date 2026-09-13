import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile, UpdateProfileInput } from "@/types/profile";

/** Thrown when an update collides with another row's unique `username`. */
export class ProfileConflictError extends Error {}

export interface ProfileRepository {
  getProfile(userId: string): Promise<Profile | null>;
  /** Partial update — only keys present in `fields` are written; everything else is untouched. */
  updateProfile(userId: string, fields: UpdateProfileInput): Promise<Profile>;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  website: string | null;
  migrated_from_manual: boolean;
  focus_area: string | null;
  creator_type: string | null;
  platform: string | null;
  audience: string | null;
  tone: string | null;
  publishing_cadence: string | null;
  primary_goal: string | null;
  ai_preference: boolean | null;
  review_cadence: string | null;
  onboarding_complete: boolean;
  subscriber_count: number | null;
  priority_platform: string | null;
  profile_link: string | null;
  posting_frequency_type: string | null;
  posting_frequency_count: number | null;
  newsletter_cadence: string | null;
  newsletter_days: string | null;
  start_date: string | null;
  desired_impact: string | null;
  newsletter_consent: boolean;
}

const SELECT_COLUMNS = [
  "id",
  "full_name",
  "username",
  "avatar_url",
  "website",
  "migrated_from_manual",
  "focus_area",
  "creator_type",
  "platform",
  "audience",
  "tone",
  "publishing_cadence",
  "primary_goal",
  "ai_preference",
  "review_cadence",
  "onboarding_complete",
  "subscriber_count",
  "priority_platform",
  "profile_link",
  "posting_frequency_type",
  "posting_frequency_count",
  "newsletter_cadence",
  "newsletter_days",
  "start_date",
  "desired_impact",
  "newsletter_consent",
].join(", ");

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    avatarUrl: row.avatar_url,
    website: row.website,
    migratedFromManual: row.migrated_from_manual,
    focusArea: row.focus_area,
    creatorType: row.creator_type,
    platform: row.platform,
    audience: row.audience,
    tone: row.tone,
    publishingCadence: row.publishing_cadence,
    primaryGoal: row.primary_goal,
    aiPreference: row.ai_preference,
    reviewCadence: row.review_cadence,
    onboardingComplete: row.onboarding_complete,
    subscriberCount: row.subscriber_count,
    priorityPlatform: row.priority_platform,
    profileLink: row.profile_link,
    postingFrequencyType: row.posting_frequency_type,
    postingFrequencyCount: row.posting_frequency_count,
    newsletterCadence: row.newsletter_cadence,
    newsletterDays: row.newsletter_days,
    startDate: row.start_date,
    desiredImpact: row.desired_impact,
    newsletterConsent: row.newsletter_consent,
  };
}

/** Maps only the keys actually present in `fields` to their DB column names. */
function toRowPatch(fields: UpdateProfileInput): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if ("fullName" in fields) patch.full_name = fields.fullName;
  if ("username" in fields) patch.username = fields.username;
  if ("avatarUrl" in fields) patch.avatar_url = fields.avatarUrl;
  if ("website" in fields) patch.website = fields.website;
  if ("focusArea" in fields) patch.focus_area = fields.focusArea;
  if ("creatorType" in fields) patch.creator_type = fields.creatorType;
  if ("platform" in fields) patch.platform = fields.platform;
  if ("audience" in fields) patch.audience = fields.audience;
  if ("tone" in fields) patch.tone = fields.tone;
  if ("publishingCadence" in fields) patch.publishing_cadence = fields.publishingCadence;
  if ("primaryGoal" in fields) patch.primary_goal = fields.primaryGoal;
  if ("aiPreference" in fields) patch.ai_preference = fields.aiPreference;
  if ("reviewCadence" in fields) patch.review_cadence = fields.reviewCadence;
  if ("onboardingComplete" in fields) patch.onboarding_complete = fields.onboardingComplete;
  if ("subscriberCount" in fields) patch.subscriber_count = fields.subscriberCount;
  if ("priorityPlatform" in fields) patch.priority_platform = fields.priorityPlatform;
  if ("profileLink" in fields) patch.profile_link = fields.profileLink;
  if ("postingFrequencyType" in fields) patch.posting_frequency_type = fields.postingFrequencyType;
  if ("postingFrequencyCount" in fields)
    patch.posting_frequency_count = fields.postingFrequencyCount;
  if ("newsletterCadence" in fields) patch.newsletter_cadence = fields.newsletterCadence;
  if ("newsletterDays" in fields) patch.newsletter_days = fields.newsletterDays;
  if ("startDate" in fields) patch.start_date = fields.startDate;
  if ("desiredImpact" in fields) patch.desired_impact = fields.desiredImpact;
  if ("newsletterConsent" in fields) patch.newsletter_consent = fields.newsletterConsent;
  return patch;
}

/**
 * Access to a creator's own `profiles` row (MAP-003 / PRD-0004, extended by
 * MAP-004 / PRD-0005). RLS scopes read/write to the caller's own row for the
 * request-bound client; the Tally webhook passes the service-role client
 * instead (unauthenticated caller, writes on a matched creator's behalf).
 */
export function createProfileRepository(client: SupabaseClient): ProfileRepository {
  return {
    async getProfile(userId) {
      const { data, error } = await client
        .from("profiles")
        .select(SELECT_COLUMNS)
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw new Error(`profiles lookup failed: ${error.message}`);
      }
      return data ? toProfile(data as unknown as ProfileRow) : null;
    },

    async updateProfile(userId, fields) {
      const { data, error } = await client
        .from("profiles")
        .update(toRowPatch(fields))
        .eq("id", userId)
        .select(SELECT_COLUMNS)
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new ProfileConflictError("username is already taken");
        }
        throw new Error(`profiles update failed: ${error.message}`);
      }
      return toProfile(data as unknown as ProfileRow);
    },
  };
}
