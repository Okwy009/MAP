# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Per `development_workflow.md`, Stage 5 — Implementation Package.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0002 — Payment Integration (Gumroad, Phase 1)

**Related PRD:** PRD-0002 v3.0 (Approved, 2026-09-06)

**Related Backlog Item:** MAP-002 — Payment Integration

**Author:** MAP OS (Engineer Mode) — drafted for Founder/Engineering review

**Date:** 2026-09-06

**Version:** 1.0

**Status:** Approved

**Target Release:** v0.1.0

---

# Scope Summary

Implements Gumroad Checkout as the paywall creators pass through after signing up (MAP-001), a Ping-notification receiver that confirms real sales via Gumroad's API before granting access, automatic access revocation on refund/dispute (FR13), and the free-access exemption for the 20 migrated creators (FR12, already flagged in `profiles` from MAP-001).

Out of scope (per PRD-0002): Stripe, Grey, any manual payment flow, tier upgrades/downgrades, tax handling.

---

# Architecture Review

**Technical feasibility:** Low-to-moderate risk. Gumroad's Ping mechanism is simple but unsigned — the verify-by-API-callback pattern below is the correct, secure substitute and is a well-established approach for Gumroad integrations.

**System impact:** Adds the `subscriptions` and `processed_sales` tables. Extends the route-protection middleware from MAP-001 to also check subscription status, not just auth.

**Dependencies:** A Gumroad account with the three product tiers (Starter/Pro/Creator+) created and matching `pricing.md`. A Gumroad API access token (for the verify-callback) and the Ping notification URL configured in Gumroad's settings.

**Scalability:** Trivial at MVP volume; Ping retries (Gumroad retries hourly for 3 hours on non-200 responses) are the only retry behavior to account for.

**Security implications:** Because Ping has no signature, the *only* trust boundary is the server-to-server callback to Gumroad's API using the private access token. The raw Ping payload must never be trusted for access-granting decisions on its own — only used to know *which* sale to go verify. Reviewed against `01_security.md` — this pattern is the documented deviation from IP-0001's Stripe-style signature-verification approach, and is intentional, not an oversight.

**ADRs referenced:** AD-004 (Gumroad Phase 1 / Stripe Phase 2), AD-008, AD-009.

---

# Technical Tasks

1. **Gumroad account configuration (manual, founder-side, blocking)** — create the three products (Starter/Pro/Creator+) in Gumroad matching `pricing.md` pricing; generate an API access token; set the Ping notification URL to the endpoint built in task 3.
2. **Payment service layer** — `services/payments/` following the layered pattern from MAP-001 (Route → Application Service → Domain Service → Repository), never calling the Gumroad API directly from route handlers.
3. **Ping receiver endpoint** — `POST /api/webhooks/gumroad`. Parses the form-encoded payload, extracts `sale_id`, `test` flag, and `subscription_id` (if present). Does **not** trust any other field from the payload directly.
4. **Verify-by-callback** — for every received `sale_id`, call Gumroad's API (`GET /v2/sales/:id` or equivalent, using the access token from task 1) to fetch the authoritative sale record server-to-server. Only proceed if this confirms a real, completed sale matching a recognized product ID.
5. **Idempotency** — before processing, check `processed_sales` for the `sale_id`; if already present, return 200 immediately without reprocessing (satisfies FR6 and Gumroad's retry behavior).
6. **Subscription record creation** — on a newly-verified sale, create/update the `subscriptions` row: creator (matched by buyer email → `creator_profiles`), tier (mapped from Gumroad product ID), status `active`, `gumroad_sale_id`, `purchased_at`.
7. **Access-gate middleware extension** — extend MAP-001's route-protection middleware: authenticated but no active subscription AND not `migrated_from_manual` → redirect to pricing screen, not the dashboard.
8. **Pricing/checkout UI** — tier selection screen linking out to the correct Gumroad product Checkout URL per tier.
9. **Pending/processing state UI** — shown on return from Gumroad while waiting for the Ping to arrive and be verified.
10. **Refund/dispute handling (FR13)** — Gumroad Ping also fires for refund events (distinguishable via the sale record's refund status when verified in task 4); on a verified refund, set the matching subscription to `inactive`, revoking access on the creator's next request.
11. **Confirmation email** — trigger via the existing Resend integration (from MAP-001) once a subscription is verified active.
12. **Founder-visible status lookup** — simple internal view/query to see a creator's subscription status (tier, active/inactive, purchase date, or "free — migrated"), satisfying FR11.
13. **Logging** — log every Ping received and its verification result (accepted/rejected/duplicate), per FR10, without logging the Gumroad access token or full payload contents. Must also explicitly escalate a failed confirmation email (task 11, `PingResult.verified.emailSent === false`) to a distinct log level (e.g. `warn`, not `info`) or its own loggable event — not inherit whatever level the surrounding Ping-outcome log line happens to use. A verified purchase whose confirmation email failed to send is otherwise invisible in production once this task replaces the current ad hoc `console.info` line in `app/api/webhooks/gumroad/route.ts`.

---

# File Changes

```
app/
  (public)/
    pricing/page.tsx                 # tier selection
  api/
    webhooks/
      gumroad/route.ts               # Ping receiver
    subscription/
      status/route.ts                # GET current creator's status

services/
  payments/
    payment-service.ts               # Application Service
    gumroad-client.ts                # thin wrapper around Gumroad API calls
    payment-domain-service.ts        # Domain Service - tier mapping, business rules
    README.md

repositories/
  subscription.repository.ts
  processed-sale.repository.ts

lib/
  gumroad.ts                         # API client config (access token, base URL)

types/
  subscription.ts

components/
  pricing/
    TierCard.tsx
  shared/
    PaymentPendingState.tsx

middleware.ts                        # extended, not replaced, from MAP-001

supabase/
  migrations/
    000003_create_subscriptions_and_processed_sales.sql

tests/
  unit/services/payments/
  integration/api/webhooks/gumroad/
  e2e/payment-flow.spec.ts
```

---

# Database Migrations

- New table: `subscriptions`
  - `id` (uuid, PK)
  - `creator_id` (uuid, FK → `creator_profiles.id`, unique)
  - `tier` (text — 'starter' | 'pro' | 'creator_plus')
  - `status` (text — 'active' | 'inactive')
  - `gumroad_sale_id` (text, nullable — null for `migrated_from_manual` free-access creators)
  - `purchased_at` (timestamptz, nullable)
  - `created_at`, `updated_at`
- New table: `processed_sales`
  - `sale_id` (text, PK) — Gumroad's sale ID, used purely for idempotency (task 5)
  - `processed_at` (timestamptz)
- RLS: creators may read only their own `subscriptions` row; writes restricted to the service role (server-side only, never client-writable).

---

# API Endpoints

| Endpoint | Auth Required | Notes |
|---|---|---|
| `POST /api/webhooks/gumroad` | No (Gumroad Ping, unauthenticated by nature) | Every `sale_id` verified via callback to Gumroad's API before any action taken |
| `GET /api/subscription/status` | Session cookie | Returns tier/status/"free — migrated" for the current creator |

---

# Component Updates

New components only: `TierCard.tsx` (pricing display), `PaymentPendingState.tsx` (waiting-for-verification UI). Follows `frontend-design` conventions; no business logic in components, consistent with `02_repository_architecture.md`.

---

# Testing Requirements

**Unit tests:** Tier-to-product-ID mapping logic; subscription status determination (active / inactive / free-migrated) — pure logic, no network calls.

**Integration tests:** Full Ping-receiver flow using a mocked Gumroad API response for the verify-callback (both "valid sale" and "sale not found/invalid" cases); idempotency (send the same `sale_id` twice, confirm single processing); refund-flow revocation.

**End-to-end tests:** Full flow from pricing screen → Gumroad Checkout (can be tested against Gumroad's own test/sandbox purchase flow) → Ping received → access granted → dashboard reachable.

**Manual QA:** One real (or Gumroad test-mode) purchase walked through end-to-end by the founder, mirroring how MAP-001's Magic Link flow was manually verified.

**Regression scope:** Confirm MAP-001's auth flow and the 20 migrated creators' free access are unaffected by the new middleware check.

**Coverage expectation:** Near-complete on the payment domain service and verify-callback logic — this is revenue-critical, same standard applied to the Decision Engine per `05_testing_strategy.md`.

---

# Rollout Plan

1. **Gumroad setup** (task 1) — founder completes this first; blocks everything else.
2. **Internal testing** — founder makes a real or test-mode purchase, walks through pricing → checkout → pending → active.
3. **Refund test** — founder issues a test refund, confirms access is revoked automatically (FR13).
4. **Alpha** — enabled for new signups; the 20 migrated creators unaffected (still free via `migrated_from_manual`).
5. **Beta/Public release** — bundled with MAP-001 as one continuous signup→pay→unlock flow for all new creators.

**Rollback plan:** If Ping delivery or the verify-callback proves unreliable in practice, founder manually checks the Gumroad dashboard and flips a creator's subscription status via the founder-visible lookup (task 12) — same manual-fallback pattern as MAP-001.

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-002)
- [x] PRD approved (PRD-0002 v3.0)
- [x] Architecture reviewed (above)
- [x] Implementation Package approved
- [x] Dependency resolved — Gumroad account, three tiers (Starter/Pro/Creator+), and API access token all in place (2026-09-07)
- [x] Acceptance criteria complete (inherited from PRD-0002)

---

# Founder / Engineering Decision

**Decision:** Approved

**Reasoning:** All Gumroad-side prerequisites are confirmed in place: three tiers created as a Membership product (not the one-time "My Accountability Partner" product, kept separate), API access token generated and stored in .env.local (not committed, following the same handling discipline as MAP-001's Supabase service role key). Nothing blocks engineering from starting on tasks 2-13.

**Date:** 2026-09-07

**Owner:** Founder
