import type { Rule } from "../rule";

const FIXED_DURATION = "15–20 minutes"; // IP-0006: not yet varied by posting_frequency_count.

/**
 * Rule 2 (fallback, always matches) — FR5. The "write today's post" task,
 * derived from platform / focus_area / tone / posting_frequency_type.
 *
 * Missing-field handling is deliberate, not an afterthought: every field used
 * here can be null (sparse or migrated-creator profiles — PRD-0006 edge
 * case), and the output must still read as one coherent sentence, never
 * "in your null tone" or a dangling clause. Each branch below is the
 * generic-but-still-a-real-sentence version of the one above it.
 */
export const todaysPostRule: Rule = {
  id: "todays-post",

  matches() {
    return true;
  },

  generate(profile) {
    const { platform, focusArea, tone, postingFrequencyType, primaryGoal } = profile;

    const title = platform ? `Write today's ${platform} post` : "Write today's post";

    const toneClause = tone ? `, in a ${tone} tone` : "";
    const description = focusArea
      ? platform
        ? `Draft a post about ${focusArea} for ${platform}${toneClause}.`
        : `Draft a post about ${focusArea}${toneClause}.`
      : platform
        ? `Draft today's post for ${platform}${toneClause}.`
        : `Draft today's post${toneClause}.`;

    const reason =
      postingFrequencyType && primaryGoal
        ? `${postingFrequencyType} posting keeps you moving toward your goal of ${primaryGoal}.`
        : primaryGoal
          ? `Consistent posting keeps you moving toward your goal of ${primaryGoal}.`
          : postingFrequencyType
            ? `You're aiming to post ${postingFrequencyType.toLowerCase()} — today's post keeps that going.`
            : "Consistent posting is what turns your content plan into real progress.";

    return {
      title,
      description,
      estimatedDuration: FIXED_DURATION,
      reason,
      successCriteria: "One post drafted and ready to publish.",
    };
  },
};
