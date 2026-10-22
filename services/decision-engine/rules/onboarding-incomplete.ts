import type { Rule } from "../rule";

/**
 * Rule 1 (checked first) — FR4. A creator who hasn't finished onboarding gets
 * pointed back to it instead of a content task; MAP doesn't have enough to
 * generate a real recommendation yet.
 */
export const onboardingIncompleteRule: Rule = {
  id: "onboarding-incomplete",

  matches(profile) {
    return !profile.onboardingComplete;
  },

  generate() {
    return {
      title: "Finish setting up your profile",
      description:
        "Complete the onboarding checklist so MAP knows your platform, focus, and goals.",
      estimatedDuration: "5–10 minutes",
      reason: "MAP needs to know your platform and focus to give you real recommendations.",
      successCriteria: "Onboarding checklist shows 100% complete.",
    };
  },
};
