# Email service (MAP-002 task 11 — purchase confirmation)

## Layering

```
services/payments/payment-service.ts      Application  calls sendPurchaseConfirmation after a verified purchase persists
        │
services/email/email-service.ts           Application  builds the message, hands it to the client
        │
services/email/templates/                 pure         subject/html/text builders — no I/O
services/email/resend-client.ts           Integration  thin wrapper over the Resend SDK
```

## Status: fully coded, cannot send yet

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` are not set (see `lib/resend.ts`). Config
is resolved lazily, only inside `resend-client.ts`'s `send()` — never eagerly —
so an unconfigured Resend never blocks Ping processing that doesn't need to
send anything (refunds, duplicates, test pings, rejections).

For an actual verified purchase, `payment-service.ts` calls
`emails.sendPurchaseConfirmation(...)` inside a try/catch and does **not**
propagate a failure: the subscription is already created and recorded by that
point, so a delivery failure only sets `PingResult.emailSent = false` (visible
in the route's log line) rather than turning an already-successful purchase
into a 500 / Gumroad retry. This is a deliberate difference from
`getGumroadConfig()`'s loud-fail-and-retry pattern — that one guards the trust
boundary itself; this one is a best-effort side effect after the transaction
already succeeded.

`RESEND_FROM_EMAIL` also needs a domain verified with Resend, which needs a
real deployed domain — MAP is still on `localhost:3000` (see
`docs/known_issues.md`, "Continue to MAP" links point at localhost).

## Copy

See `templates/purchase-confirmation.ts`. Tier name and price come from the
verified Gumroad sale itself (`TIER_VARIANT_LABELS`, `sale.formattedDisplayPrice`
— Gumroad's own currency formatting, not hand-rolled), not a hardcoded price
table, so it can't drift from what was actually charged.
