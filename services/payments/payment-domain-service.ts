import type { GumroadSale, PingResult, Tier } from "@/types/subscription";

export interface PaymentDomainConfig {
  /** The one Gumroad product ("MAP App Access") whose sales unlock MAP. */
  productId: string;
  /** Key inside the sale's `variants` object holding the tier label (e.g. "Tier"). */
  tierVariantKey: string;
}

/**
 * Pure payment business rules. No I/O — every method is synchronous and
 * deterministic, so it can be unit-tested without network or database.
 */
export interface PaymentDomainService {
  /** Resolves the MAP tier for one of our sales, or null if it isn't ours / has no known tier. */
  tierForSale(sale: GumroadSale): Tier | null;
  /** Classifies an already-fetched, authoritative sale. Test-mode handling lives in the application service. */
  classifySale(sale: GumroadSale): PingResult;
}

const TIER_BY_NORMALIZED_LABEL: Record<string, Tier> = {
  starter: "starter",
  pro: "pro",
  creatorplus: "creator_plus",
  creator: "creator_plus",
};

/** "Creator+" / "Creator Plus" -> "creatorplus"/"creator", " STARTER " -> "starter" */
function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function createPaymentDomainService(config: PaymentDomainConfig): PaymentDomainService {
  function tierForSale(sale: GumroadSale): Tier | null {
    if (sale.productId !== config.productId) return null;
    const label = sale.variants[config.tierVariantKey];
    if (!label) return null;
    return TIER_BY_NORMALIZED_LABEL[normalizeLabel(label)] ?? null;
  }

  function classifySale(sale: GumroadSale): PingResult {
    if (sale.productId !== config.productId) {
      return { outcome: "rejected", saleId: sale.id, reason: "unrecognized_product" };
    }
    if (sale.refunded || sale.disputed || sale.chargedback) {
      return { outcome: "verified_refund", sale };
    }
    const tier = tierForSale(sale);
    if (!tier) {
      return { outcome: "rejected", saleId: sale.id, reason: "unrecognized_tier" };
    }
    return { outcome: "verified", tier, sale };
  }

  return { tierForSale, classifySale };
}
