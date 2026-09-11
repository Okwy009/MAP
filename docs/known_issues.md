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

## Issue

Description:

Affected Area:

Severity:

Workaround:

Root Cause:

Status:

Owner:

Target Resolution:
