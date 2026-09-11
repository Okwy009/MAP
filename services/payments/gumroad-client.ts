import { z } from "zod";

import type { GumroadConfig } from "@/lib/gumroad";
import type { GumroadSale } from "@/types/subscription";

const saleSchema = z
  .object({
    id: z.string(),
    product_id: z.string(),
    product_name: z.string().default(""),
    email: z.string().default(""),
    variants: z.record(z.string()).default({}),
    formatted_display_price: z.string().default(""),
    created_at: z.string().nullish(),
    subscription_id: z.string().nullish(),
    refunded: z.boolean().default(false),
    disputed: z.boolean().default(false),
    // Gumroad has spelled this field both ways across API versions.
    chargedback: z.boolean().optional(),
    chargedbacked: z.boolean().optional(),
    test: z.boolean().optional(),
  })
  .passthrough();

const responseSchema = z.object({
  success: z.boolean(),
  sale: saleSchema.optional(),
});

export interface GumroadClient {
  /** Fetches the authoritative sale record. Returns null if Gumroad has no such sale. */
  getSale(saleId: string): Promise<GumroadSale | null>;
}

/**
 * Thin wrapper around Gumroad's REST API. No business rules here — it only turns
 * an HTTP response into a typed {@link GumroadSale}. The access token is sent as
 * a Bearer header (kept out of the URL so it never lands in a log line).
 */
export function createGumroadClient(config: GumroadConfig): GumroadClient {
  return {
    async getSale(saleId) {
      const res = await fetch(`${config.apiBase}/sales/${encodeURIComponent(saleId)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${config.accessToken}` },
        cache: "no-store",
      });

      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Gumroad sales lookup failed (${res.status})`);
      }

      const parsed = responseSchema.safeParse(await res.json());
      if (!parsed.success || !parsed.data.success || !parsed.data.sale) {
        return null;
      }

      const s = parsed.data.sale;
      return {
        id: s.id,
        productId: s.product_id,
        productName: s.product_name,
        email: s.email,
        variants: s.variants,
        formattedDisplayPrice: s.formatted_display_price,
        purchasedAt: s.created_at ?? null,
        subscriptionId: s.subscription_id ?? null,
        refunded: s.refunded,
        disputed: s.disputed,
        chargedback: s.chargedback ?? s.chargedbacked ?? false,
        test: s.test ?? false,
      };
    },
  };
}
