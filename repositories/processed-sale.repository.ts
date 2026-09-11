import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Idempotency ledger for Gumroad sales (IP-0002 task 5). Backed by the
 * `processed_sales` table; RLS has no policies, so this only works via the
 * service-role client.
 */
export interface ProcessedSaleRepository {
  has(saleId: string): Promise<boolean>;
  record(saleId: string): Promise<void>;
}

export function createProcessedSaleRepository(client: SupabaseClient): ProcessedSaleRepository {
  return {
    async has(saleId) {
      const { data, error } = await client
        .from("processed_sales")
        .select("sale_id")
        .eq("sale_id", saleId)
        .maybeSingle();

      if (error) {
        throw new Error(`processed_sales lookup failed: ${error.message}`);
      }
      return data !== null;
    },

    async record(saleId) {
      const { error } = await client.from("processed_sales").insert({ sale_id: saleId });

      if (error) {
        // 23505 = unique_violation: a concurrent delivery of the same Ping
        // already recorded this sale. That is the idempotent outcome, not a failure.
        if (error.code === "23505") return;
        throw new Error(`processed_sales insert failed: ${error.message}`);
      }
    },
  };
}
