import type { SupabaseClient } from "@supabase/supabase-js";

import type { Tier } from "@/types/subscription";

export type EntitlementReason = "free_migrated" | "active_subscription" | "none";

export interface Entitlement {
  entitled: boolean;
  reason: EntitlementReason;
  tier: Tier | null;
}

/**
 * Active subscription OR the free migrated_from_manual flag (MAP-002 FR8/FR12).
 * Shared by the access-gate middleware and the creator-facing status endpoint
 * so the two never drift. `client` must be RLS-scoped to `userId` (the
 * request-bound SSR client) — reads are the caller's own rows only.
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

  return {
    entitled: false,
    reason: "none",
    tier: (subscription?.tier as Tier | undefined) ?? null,
  };
}
