import { TierCard } from "@/components/pricing/TierCard";
import { PaymentPendingState } from "@/components/shared/PaymentPendingState";
import { buildCheckoutUrl } from "@/lib/gumroad";
import type { Tier } from "@/types/subscription";

// Mirrors docs/product/pricing.md — the approved source for copy and pricing.
const TIERS: { tier: Tier; name: string; priceLabel: string; features: string[] }[] = [
  {
    tier: "starter",
    name: "Starter",
    priceLabel: "$19",
    features: ["Basic next-step generation", "Daily usage", "Limited context memory"],
  },
  {
    tier: "pro",
    name: "Pro",
    priceLabel: "$49",
    features: [
      "Full context awareness (goals, history)",
      "Adaptive planning based on energy/time",
      "Publishing-focused workflows",
    ],
  },
  {
    tier: "creator_plus",
    name: "Creator+",
    priceLabel: "$99",
    features: [
      "Advanced personalization",
      "Content system support (Substack, blogs, etc.)",
      "Accountability loops",
      "Weekly review summaries",
    ],
  },
];

/**
 * Tier selection screen (IP-0002 task 8 / FR1). Reached by an authenticated
 * creator without an active subscription (the access-gate middleware sends
 * them here — lib/access-gate.ts). Each card links straight to Gumroad
 * Checkout with the tier preselected (FR2); MAP never handles payment details.
 *
 * <PaymentPendingState /> (task 9) is the fallback for the rare case someone
 * lands back here before their Ping has finished processing — Gumroad's own
 * post-purchase page (Membership products don't support a custom redirect)
 * sends buyers to the site root, and the access-gate middleware already
 * handles the common case where the webhook beat them there.
 */
export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="mt-2 text-muted-foreground">
          Pick the plan that fits how you work. Cancel anytime.
        </p>
      </div>
      <PaymentPendingState />
      <div className="grid gap-6 sm:grid-cols-3">
        {TIERS.map((t) => (
          <TierCard
            key={t.tier}
            name={t.name}
            priceLabel={t.priceLabel}
            features={t.features}
            checkoutUrl={buildCheckoutUrl(t.tier)}
          />
        ))}
      </div>
    </div>
  );
}
