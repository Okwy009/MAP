import type { Profile } from "@/types/profile";
import type { Recommendation } from "@/types/recommendation";

import type { Rule } from "./rule";
import { onboardingIncompleteRule } from "./rules/onboarding-incomplete";
import { todaysPostRule } from "./rules/todays-post";

/**
 * Ordered, first-match-wins (AD-007). `todaysPostRule` always matches, so it
 * must stay last — the true fallback. Future rules (task-resume, energy-based,
 * Recovery Mode) slot in before it once MAP-006/008 exist.
 */
const RULES: Rule[] = [onboardingIncompleteRule, todaysPostRule];

/** Pure — no I/O. Exposed separately from generateRecommendation so a caller can log *which* rule fired (explainability, NFR). */
export function matchRule(profile: Profile): Rule {
  const rule = RULES.find((r) => r.matches(profile));
  if (!rule) {
    // Unreachable: todaysPostRule.matches() always returns true.
    throw new Error("No rule matched a profile — the fallback rule should always match");
  }
  return rule;
}

export function generateRecommendation(profile: Profile): Recommendation {
  return matchRule(profile).generate(profile);
}
