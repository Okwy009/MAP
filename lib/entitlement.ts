import type { SupabaseClient } from "@supabase/supabase-js";

import type { EffectiveTier, Tier } from "@/types/subscription";

export type EntitlementReason = "free_migrated" | "active_subscription" | "free_default";

export interface Entitlement {
  /** Always true post-freemium-pivot — there is no "blocked" state anymore. */
  entitled: boolean;
  reason: EntitlementReason;
  /** null only for migrated_from_manual — deliberately not mapped onto the tier ladder yet (docs/known_issues.md). */
  tier: EffectiveTier | null;
}

/**
 * A creator's effective tier: the free migrated_from_manual grandfather flag,
 * an active paid subscription, or — the freemium default (decision_log.md
 * "Freemium pivot", 2026-09-12) — the free tier for everyone else, including
 * a creator with no subscription row or an inactive/refunded one. Shared by
 * GET /api/subscription/status and PaymentPendingState's polling check.
 * `client` must be RLS-scoped to `userId` (the request-bound SSR client) —
 * reads are the caller's own rows only.
 */
export async function getEntitlement(client: SupabaseClient, userId: string): Promise<Entitlement> {
  const { data: profile } = await client
    .from("profiles")
    .select("migrated_from_manual")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.migrated_from_manual) {
    return { entitled: true, reason: "free_migrated", tier: null };
  }

  const { data: subscription } = await client
    .from("subscriptions")
    .select("tier, status")
    .eq("creator_id", userId)
    .maybeSingle();

  if (subscription?.status === "active") {
    return { entitled: true, reason: "active_subscription", tier: subscription.tier as Tier };
  }

  // Freemium: no row, or an inactive/refunded one, collapses to the free
  // baseline — never a block. Historical paid tier is not surfaced once inactive.
  return { entitled: true, reason: "free_default", tier: "free" };
}
