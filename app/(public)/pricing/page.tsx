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
 * Voluntary upgrade screen (IP-0002 task 8 / FR2), not a gate. Freemium pivot
 * (decision_log.md "Freemium pivot", 2026-09-12) removed the hard paywall —
 * every authenticated creator starts at the free tier by default
 * (lib/entitlement.ts) and reaches this page only via a normal link, never a
 * redirect. Each card links straight to Gumroad Checkout with the tier
 * preselected (FR2); MAP never handles payment details.
 *
 * Contextual triggering (surfacing this after onboarding / real value
 * delivered, per pricing.md's "Upgrade Flow") is out of scope until MAP-004.
 *
 * <PaymentPendingState /> (task 9) — see its own doc comment: its original
 * trigger path (the gate bouncing an unconfirmed purchaser back here) no
 * longer exists post-pivot.
 */
export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">Upgrade your plan</h1>
        <p className="mt-2 text-muted-foreground">Unlock more as you grow. Cancel anytime.</p>
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
