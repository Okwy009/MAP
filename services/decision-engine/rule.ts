import type { Profile } from "@/types/profile";
import type { Recommendation } from "@/types/recommendation";

/**
 * A self-contained recommendation rule (FR8 / AD-007's ordered pipeline).
 * Adding a new rule (task-resume, energy-based, Recovery Mode — once MAP-006/008
 * exist) means a new file implementing this interface plus one line
 * registering it in engine.ts's order — never a change to an existing rule.
 */
export interface Rule {
  id: string;
  matches(profile: Profile): boolean;
  generate(profile: Profile): Recommendation;
}
