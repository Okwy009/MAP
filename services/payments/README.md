# Payment service (MAP-002, Gumroad — Phase 1)

Implements the Gumroad paywall per PRD-0002 v3.0 / IP-0002.

## Layering

```
app/api/webhooks/gumroad/route.ts        Route        HTTP in/out, payload parsing, status codes
        │
services/payments/payment-service.ts     Application  orchestrates verify -> classify -> (persist)
        │
services/payments/payment-domain-service  Domain       pure rules: product/tier match, sale classification
        │
services/payments/gumroad-client.ts      Integration  GET /v2/sales/:id -> typed GumroadSale
repositories/*.repository.ts              Repository   subscriptions / processed_sales (service-role)
```

Route handlers never call the Gumroad API or the database directly. Dependencies
are passed into `createPaymentService(...)` so tests inject fakes.

## The one rule

Gumroad's **Ping is unsigned**. The raw Ping payload is used only to learn which
`sale_id` to verify. Every access decision is based solely on the authoritative
record returned by the server-to-server callback to `GET /v2/sales/:id`
(`gumroad-client.ts`), authenticated with `GUMROAD_ACCESS_TOKEN` (Bearer header,
never in a URL or log line).

## Configuration (env)

"MAP App Access" is **one** Gumroad product with a Tier variant (Starter / Pro /
Creator+). All tiers share the same `product_id`; the purchased tier comes from
the sale's `variants` object, e.g. `{ "Tier": "Starter" }`.

| Var                        | Purpose                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `GUMROAD_ACCESS_TOKEN`     | Bearer token for the verify callback. Runtime only, never committed.                  |
| `GUMROAD_PRODUCT_ID`       | The one "MAP App Access" product id. Sales of any other product are rejected.         |
| `GUMROAD_TIER_VARIANT_KEY` | Optional, default `Tier`. Key in the sale's `variants` object holding the tier label. |

Classification (`payment-domain-service.ts`):

- `product_id` != `GUMROAD_PRODUCT_ID` → rejected `unrecognized_product`
- that product but `variants[Tier]` label maps to no known tier → rejected `unrecognized_tier`
- labels are matched case/punctuation-insensitively: `Starter`→`starter`, `Pro`→`pro`, `Creator+` / `Creator Plus`→`creator_plus`

The reverse direction (tier → exact Gumroad label, for outbound checkout links)
lives in `lib/gumroad.ts` as `TIER_VARIANT_LABELS` — a strict map, deliberately
separate from the lenient inbound classification above.

`NEXT_PUBLIC_GUMROAD_CHECKOUT_URL` — the product's public storefront URL (e.g.
`https://seller.gumroad.com/l/permalink`). Not a secret. `buildCheckoutUrl(tier)`
appends `?variant=<label>&wanted=true` to deep-link straight into Checkout with
the tier preselected.

## Status — built vs. pending

Built (IP-0002 tasks 2–13, all tasks except task 1, founder-side): service layer, Ping receiver, verify-by-callback,
sale classification, idempotency (`duplicate` short-circuit on `processed_sales`),
subscription persistence, the access-gate middleware extension
(`lib/access-gate.ts` + `lib/supabase/middleware.ts`), the pricing screen
(`app/(public)/pricing/page.tsx`, `components/pricing/TierCard.tsx`) linking
each tier to its Gumroad Checkout URL, the pending-state fallback
(`components/shared/PaymentPendingState.tsx` + `GET /api/subscription/status`),
and refund/dispute revocation (FR13). A `verified` sale resolves the buyer's
account by email, upserts the `subscriptions` row (`status = active`, one per
creator), then records the `sale_id`. A buyer email with no MAP account →
`rejected` (`no_matching_account`), not recorded, left replayable (PRD-0002 edge
case). A `verified_refund` — refunded, disputed, or charged back — calls
`subscriptions.markInactiveBySaleId(sale.id)` then records the sale, same
persist-before-record ordering as a purchase; a `sale_id` no longer matching any
subscription (superseded by a later purchase) is a no-op, never touching a
creator's unrelated, currently-active subscription. All three repositories run
against the service-role client (`lib/supabase/service.ts`). A `verified`
purchase also triggers `services/email/` (task 11) — see its own README for
the layering, the exact copy, and why a delivery failure there is deliberately
non-fatal to Ping processing (`PingResult.verified.emailSent` reports it
instead). Not yet able to actually send: `RESEND_API_KEY` /
`RESEND_FROM_EMAIL` aren't set, and the "Continue to MAP" link they'd carry is
still `localhost` (`docs/known_issues.md`).

**Task 9's scope changed from the original plan.** Gumroad Membership products
don't support a custom post-purchase redirect — buyers land on Gumroad's own
confirmation page (founder added a manual "Continue to MAP" link there, to the
site root). So there's no "just paid" signal in the URL, and the access-gate
middleware already handles the common case (webhook usually beats the buyer
back to MAP). `PaymentPendingState` is now a fallback banner on `/pricing`
(where the gate sends anyone not yet entitled), polling
`getEntitlement`/`/api/subscription/status` and auto-redirecting home once
entitled — not a dedicated primary-flow screen. `lib/entitlement.ts` is shared
by the gate and the status endpoint so the two definitions of "entitled" can't
drift.

## Founder lookup (task 12 / FR11)

Read-only, for support purposes — FR11 and the task text both say "view," and
there's no admin/founder role system anywhere in this codebase to safely gate
a write action, so this deliberately doesn't build one. Run in the Supabase
SQL editor (Studio connects as an elevated role — bypasses RLS, and can join
`auth.users` for email since `profiles` has none):

```sql
select
  u.email,
  p.full_name,
  p.migrated_from_manual,
  s.tier,
  s.status,
  s.purchased_at,
  s.gumroad_sale_id,
  case
    when p.migrated_from_manual then 'free — migrated'
    when s.status = 'active' then s.tier || ' (active)'
    when s.status is not null then s.tier || ' (' || s.status || ')'
    else 'none'
  end as display_status
from profiles p
join auth.users u on u.id = p.id
left join subscriptions s on s.creator_id = p.id
-- where u.email = 'someone@example.com'   -- uncomment to look up one creator
order by u.email;
```

Deliberately **not** a `public`-schema SQL view: a view in `public` is exposed
over PostgREST by default, and one joining `auth.users.email` would leak every
creator's email through the API unless explicitly `revoke`d from `anon` /
`authenticated` — extra surface to get wrong for something used rarely. A
plain query run in Studio has zero schema footprint and nothing to review. If
this ends up used often enough that re-pasting the query is annoying, the
view + `revoke` version is a five-minute upgrade — flag it and I'll build it
(as a migration, for review first, same as 000003).

Verified by the founder in Supabase Studio: all 20 migrated creators show
`display_status = 'free — migrated'` with `tier`/`status`/`purchased_at`/
`gumroad_sale_id` all null, as expected. The paid branch (`'<tier> (active)'`)
is untested — no real purchase has completed yet.

## Task 13 (logging)

`services/payments/ping-logger.ts` — every Ping outcome logs one line
(`accepted`/`rejected`/`duplicate`/etc., per FR10), never the access token or
raw payload. A malformed body or missing `sale_id` also logs (`warn`) — that
was a silent gap before this task; both are still "received" per FR10.

`emailSent === false` is escalated as its own distinct event
(`[gumroad-ping-email-failure]`, `console.warn`), separate from and in
addition to the routine outcome line — not inherited from it, per the
explicit requirement added to IP-0002 task 13. Verified against the real
module: a sent email logs one `info` line and zero `warn` lines; a failed one
logs the same `info` line (`emailSent=false`) plus exactly one distinct `warn`
line naming the sale.

Pending:

- Task 1's own dependency (Resend account + verified domain) blocks task 11 from actually sending — code-complete, not yet runnable in production
- Real-domain deployment (`docs/known_issues.md`) blocks the "Continue to MAP" links and Resend's verified-domain requirement
- No end-to-end test yet of a real (or Gumroad test-mode) paid purchase — the 20 migrated creators exercised the free-access path only (task 12 verification)
