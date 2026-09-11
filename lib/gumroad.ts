import type { Tier } from "@/types/subscription";

const GUMROAD_API_BASE = "https://api.gumroad.com/v2";

export interface GumroadConfig {
  apiBase: string;
  accessToken: string;
  /** The single Gumroad product ("MAP App Access") whose sales unlock MAP. */
  productId: string;
  /** Key inside a sale's `variants` object that holds the tier label. */
  tierVariantKey: string;
}

/**
 * Reads Gumroad config from the environment. Throws on missing required values so
 * a misconfiguration surfaces loudly at the Ping receiver (which returns 500,
 * letting Gumroad retry) rather than silently rejecting real sales.
 *
 *   GUMROAD_ACCESS_TOKEN      — Bearer token for the verify callback (runtime only, never committed)
 *   GUMROAD_PRODUCT_ID        — the one "MAP App Access" product id
 *   GUMROAD_TIER_VARIANT_KEY  — optional, defaults to "Tier"
 */
export function getGumroadConfig(): GumroadConfig {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("GUMROAD_ACCESS_TOKEN is not set");
  }

  const productId = process.env.GUMROAD_PRODUCT_ID;
  if (!productId) {
    throw new Error("GUMROAD_PRODUCT_ID is not set");
  }

  return {
    apiBase: GUMROAD_API_BASE,
    accessToken,
    productId,
    tierVariantKey: process.env.GUMROAD_TIER_VARIANT_KEY || "Tier",
  };
}

/**
 * Exact Gumroad variant option labels for the "Tier" category on the MAP App
 * Access product — confirmed against the live product (GET /v2/products).
 * Must stay in sync with whatever the options are literally named in Gumroad.
 */
export const TIER_VARIANT_LABELS: Record<Tier, string> = {
  starter: "Starter",
  pro: "Pro",
  creator_plus: "Creator+",
};

/**
 * Public checkout base URL for the MAP App Access product
 * (e.g. https://seller.gumroad.com/l/permalink). This is the public storefront
 * link, not a secret — NEXT_PUBLIC_ is correct and intentional here.
 */
export function getGumroadCheckoutBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_GUMROAD_CHECKOUT_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_GUMROAD_CHECKOUT_URL is not set");
  }
  return url;
}

/**
 * Deep-links straight to Gumroad Checkout with the given tier's variant
 * preselected (IP-0002 task 8 / FR2). `variant` must match the option name
 * exactly; `wanted=true` skips the product page and opens checkout directly.
 */
export function buildCheckoutUrl(tier: Tier): string {
  const url = new URL(getGumroadCheckoutBaseUrl());
  url.searchParams.set("variant", TIER_VARIANT_LABELS[tier]);
  url.searchParams.set("wanted", "true");
  return url.toString();
}
