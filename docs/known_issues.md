# Known Issues

## Issue: Support contact is a personal inbox, not a support alias

Description:

The payment pending-state fallback (`PaymentPendingState.tsx`, shown when a
creator's purchase still isn't confirmed after ~60s of polling) tells the
creator to email `onuohafrankline99@gmail.com` for manual help. This is the
founder's personal Gmail, used as an MVP placeholder — no dedicated support
alias exists yet.

Affected Area:

MAP-002 Payment Integration — `components/shared/PaymentPendingState.tsx`

Severity:

Low. Functional for a small, founder-monitored alpha, but not appropriate to
expose as the public support contact at wider launch (personal inbox, no
team routing, no separation from personal email).

Workaround:

None needed at current scale.

Root Cause:

No support email/alias has been set up for MAP yet.

Status:

Open

Owner:

Founder

Target Resolution:

Before wider public launch — set up a proper support alias (e.g.
`support@` the eventual MAP domain) and update `SUPPORT_EMAIL` in
`PaymentPendingState.tsx`.

## Issue: Refund/chargeback on a superseded sale is a silent no-op

Description:

A chargeback or refund on a Gumroad sale that's since been superseded by a
repurchase (e.g., a tier upgrade) is currently a silent no-op rather than
flagged for manual review. Because a creator has exactly one `subscriptions`
row and `gumroad_sale_id` is overwritten on repurchase, a refund Ping for the
old `sale_id` matches no row. This means it's possible to get a refund on an
old sale while retaining the access granted by a later, unrelated purchase —
a real, if narrow, fraud/money-leak path.

Affected Area:

MAP-002 Payment Integration — `services/payments/payment-service.ts` (the
`verified_refund` branch), `repositories/subscription.repository.ts`
(`markInactiveBySaleId`)

Severity:

Medium — narrow (requires a specific repurchase-then-refund sequence), but a
real money-leak path, not just a UX gap.

Workaround:

None automated. Would require manually cross-referencing Gumroad's dashboard
refund history against MAP subscription history to catch.

Root Cause:

`markInactiveBySaleId` matches on `gumroad_sale_id`, which is overwritten on
repurchase (one subscription row per creator). This is intentional — it
prevents a stale refund from revoking a creator's current, unrelated active
subscription — but there's no fallback to flag the mismatch for review when
it happens.

Status:

Open

Owner:

Founder

Target Resolution:

When upgrade/downgrade support is built.

## Issue: "Continue to MAP" links point at localhost until MAP is deployed

Description:

Two separate "Continue to MAP" links currently point at
`http://localhost:3000` and won't work for a real customer until MAP has a
deployed public domain: (1) the purchase-confirmation email's CTA button,
built from `NEXT_PUBLIC_SITE_URL`; (2) the founder's manually-configured link
on Gumroad's own post-purchase confirmation page (Gumroad Membership products
don't support a custom post-purchase redirect, so this is set by hand outside
the codebase). Same root cause, tracked together.

Affected Area:

`services/email/templates/purchase-confirmation.ts` (`siteUrl`), and the
manual link on the Gumroad "MAP App Access" product's confirmation page
(outside this repo).

Severity:

Medium — blocks real customers from returning to MAP after purchase, but
only matters once real (non-founder) purchases happen, and neither the email
sending (blocked on `RESEND_API_KEY`/a verified domain) nor a public MAP
deployment exist yet regardless.

Workaround:

None needed pre-deployment.

Root Cause:

`NEXT_PUBLIC_SITE_URL` is still `http://localhost:3000` (see `.env.local`);
no production domain exists yet.

Status:

Open

Owner:

Founder

Target Resolution:

When MAP is deployed to a real domain — update `NEXT_PUBLIC_SITE_URL` and
the manual Gumroad confirmation-page link to match.

## Issue: migrated_from_manual has no defined tier under the freemium model

Description:

The 20 creators migrated in MAP-001 (`migrated_from_manual = true`) were
promised full, unrestricted access under the old binary paywall model
(PRD-0001 FR11, PRD-0002 FR12). Under the freemium pivot's 4-stage tier
ladder (decision_log.md "MAP Experience stages", 2026-09-12),
`getEntitlement` still returns `tier: null` for them — deliberately left
unchanged rather than mapped onto free/starter/pro/creator_plus. This has no
functional effect today since nothing gates features by tier yet, but needs
a real decision before MAP-004/005 build tier-specific features: does their
grandfathered promise mean Stage 4 (Creator+)-equivalent access forever, or
does it reset to Stage 1 (free) now that a real tier ladder exists?

Affected Area:

`lib/entitlement.ts` (`getEntitlement`'s `migrated_from_manual` branch)

Severity:

Medium — no user-facing impact yet, but blocks correctly scoping
MAP-004/005's tier-gated features, and affects a real promise made to 20
real people.

Workaround:

None needed until tier-gated features exist.

Root Cause:

The `migrated_from_manual` exemption predates the tier ladder — it was
designed for a binary paid/unpaid model, not a 4-stage one.

Status:

Open

Owner:

Founder

Target Resolution:

Before MAP-004/005 build any tier-gated feature.

## Issue: post-purchase confirmation UI and /pricing's auto-redirect need redesigning together

Description:

Two linked reassurance-UI gaps from the freemium pivot, to be redesigned
together once real contextual upgrade-flow UX exists (MAP-004+ territory):
(1) `PaymentPendingState`'s original trigger path is gone — it used to be
reached because the old access-gate bounced an unconfirmed purchaser from
`/` back to `/pricing` while their Ping was still processing; that bounce no
longer exists, so a real purchaser landing on `/` after checkout now just
sees the free-tier dashboard immediately and never sees this banner. (2)
Because `/pricing` is now voluntarily visited by anyone (an existing
subscriber browsing higher tiers, a migrated creator poking around),
`PaymentPendingState`'s poll (`tier !== "free"`) auto-redirects them back to
`/` a few seconds after they arrive, since their already-resolved tier reads
as "done." **Actual payment processing (Ping verification, subscription
persistence, refund revocation) is entirely unaffected — this is purely a
reassurance-UI gap**, not a correctness or security issue.

Affected Area:

`components/shared/PaymentPendingState.tsx`, `app/(public)/pricing/page.tsx`

Severity:

Low — cosmetic/UX only, no functional or payment-correctness impact.

Workaround:

None needed; a creator who just paid still gets full access at their new
tier immediately once the Ping is processed, they just don't see a "confirmed"
UI moment for it right now.

Root Cause:

Both behaviors were designed around the old hard-paywall model, where
`/pricing` was only ever reached involuntarily (via the gate) by someone
not yet entitled. The freemium pivot (decision_log.md "Freemium pivot",
2026-09-12) made `/pricing` a voluntarily-visited page for anyone, which
breaks both assumptions these components were built on.

Status:

Open

Owner:

Founder

Target Resolution:

Redesign together once MAP-004's contextual upgrade-flow UX is built —
needs an actual "just completed checkout" signal (currently none exists)
before either behavior can be fixed correctly.

## Issue

Description:

Affected Area:

Severity:

Workaround:

Root Cause:

Status:

Owner:

Target Resolution:
