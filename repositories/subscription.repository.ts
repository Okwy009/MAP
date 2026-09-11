import type { SupabaseClient } from "@supabase/supabase-js";

import type { Subscription, SubscriptionStatus, Tier } from "@/types/subscription";

export interface UpsertActiveInput {
  creatorId: string;
  tier: Tier;
  gumroadSaleId: string;
  purchasedAt: string | null;
}

/**
 * Access to the `subscriptions` table (IP-0002 tasks 6, 10, 12). Reads are
 * RLS-scoped to the owning creator; writes bypass RLS and require the
 * service-role client.
 */
export interface SubscriptionRepository {
  findByCreatorId(creatorId: string): Promise<Subscription | null>;
  upsertActive(input: UpsertActiveInput): Promise<void>;
  markInactiveBySaleId(gumroadSaleId: string): Promise<void>;
}

interface SubscriptionRow {
  id: string;
  creator_id: string;
  tier: Tier;
  status: SubscriptionStatus;
  gumroad_sale_id: string | null;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    creatorId: row.creator_id,
    tier: row.tier,
    status: row.status,
    gumroadSaleId: row.gumroad_sale_id,
    purchasedAt: row.purchased_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createSubscriptionRepository(client: SupabaseClient): SubscriptionRepository {
  return {
    async findByCreatorId(creatorId) {
      const { data, error } = await client
        .from("subscriptions")
        .select("*")
        .eq("creator_id", creatorId)
        .maybeSingle();

      if (error) {
        throw new Error(`subscriptions lookup failed: ${error.message}`);
      }
      return data ? toSubscription(data as SubscriptionRow) : null;
    },

    async upsertActive({ creatorId, tier, gumroadSaleId, purchasedAt }) {
      // `creator_id` is unique — one subscription per creator. A repeat purchase
      // updates the same row rather than creating a duplicate (PRD-0002 edge case).
      const { error } = await client.from("subscriptions").upsert(
        {
          creator_id: creatorId,
          tier,
          status: "active" satisfies SubscriptionStatus,
          gumroad_sale_id: gumroadSaleId,
          purchased_at: purchasedAt,
        },
        { onConflict: "creator_id" }
      );

      if (error) {
        throw new Error(`subscriptions upsert failed: ${error.message}`);
      }
    },

    async markInactiveBySaleId(gumroadSaleId) {
      const { error } = await client
        .from("subscriptions")
        .update({ status: "inactive" satisfies SubscriptionStatus })
        .eq("gumroad_sale_id", gumroadSaleId);

      if (error) {
        throw new Error(`subscriptions deactivate failed: ${error.message}`);
      }
    },
  };
}
