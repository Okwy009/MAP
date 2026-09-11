export type Tier = "starter" | "pro" | "creator_plus";

export type SubscriptionStatus = "active" | "inactive";

export interface Subscription {
  id: string;
  creatorId: string;
  tier: Tier;
  status: SubscriptionStatus;
  gumroadSaleId: string | null;
  purchasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The authoritative sale record fetched server-to-server from Gumroad's API
 * (GET /v2/sales/:id). This is the only Gumroad data the system trusts for
 * access decisions — never the raw Ping payload.
 */
export interface GumroadSale {
  id: string;
  productId: string;
  productName: string;
  email: string;
  /**
   * Variant selections as `{ category: label }`, e.g. `{ "Tier": "Starter" }`.
   * "MAP App Access" is one product with a Tier variant, so this is how the
   * purchased tier is identified — not the product ID.
   */
  variants: Record<string, string>;
  /** Gumroad's own currency-formatted charge amount, e.g. "$19". Used for the confirmation email. */
  formattedDisplayPrice: string;
  purchasedAt: string | null;
  subscriptionId: string | null;
  refunded: boolean;
  disputed: boolean;
  chargedback: boolean;
  test: boolean;
}

/**
 * The only fields extracted from a raw Gumroad Ping. Everything else in the
 * payload is ignored — the Ping is unsigned and tells us only which sale to go
 * verify.
 */
export interface GumroadPing {
  saleId: string;
  test: boolean;
  subscriptionId: string | null;
}

export type PingResult =
  | { outcome: "verified"; tier: Tier; sale: GumroadSale; emailSent?: boolean }
  | { outcome: "verified_refund"; sale: GumroadSale }
  | { outcome: "ignored_test"; saleId: string }
  | { outcome: "duplicate"; saleId: string }
  | { outcome: "rejected"; saleId: string; reason: string };
