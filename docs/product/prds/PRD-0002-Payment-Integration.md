# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> The purpose of this document is to ensure the problem is understood before a solution is built.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-002 — Payment Integration (Phase 1: Gumroad)

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-06

**Version:** 3.0 (supersedes v1.0 Gumroad, v1.5 Stripe-only, v2.0 manual-via-Grey)

**Status:** Approved

---

# Executive Summary

MAP needs a way to convert an authenticated creator into a paying subscriber. This is Phase 1: **Gumroad** as the payment provider, restoring the original AD-004 decision, chosen because it can be built and shipped now with no blocking prerequisite.

**Phase 2 (future, tracked but out of scope here):** Once MAP is registered as a US entity, Stripe becomes the target provider — better suited to MAP's recurring-subscription pricing model (`pricing.md`) than Gumroad. That migration is a future PRD, not this one. AD-004 will document both phases so this isn't lost context.

**Manual payment via Grey was considered and set aside** — Grey is a multi-currency receiving account, not a checkout/webhook API, and a fully manual process doesn't scale even as a stopgap. Gumroad gives an automated, webhook-verified flow today without waiting on US registration.

This is the second feature in the MVP build order, sitting between Authentication (MAP-001, done) and Creator Profile / Onboarding (MAP-003/004) — nothing downstream should be reachable without payment (or the free-access exemption below).

**The 20 previously manually-onboarded creators (migrated in MAP-001) receive free, permanent access** and are exempt from this paywall entirely — unchanged across every version of this PRD (FR12).

---

# Problem Statement

Right now, every authenticated creator can reach the full dashboard with no payment step at all — MAP-001 deliberately scoped payment out. There is no way to charge for MAP, no way to distinguish a paying creator from a free signup, and no mechanism to unlock or revoke access based on payment status.

- **What problem exists?** Authentication proves identity, not entitlement. MAP has no concept of "paid" yet.
- **Who experiences it?** Every creator — right now anyone who signs up gets full access for free.
- **Why is it important?** MAP cannot generate revenue, and downstream features shouldn't be built assuming free access forever.
- **How do users solve this today?** They don't — there is no paywall.

---

# Customer

**Primary User:** A creator who has completed sign-up (MAP-001) and is ready to purchase access.

**Secondary User:** The founder, who needs visibility into who has paid and at what tier.

**Jobs To Be Done:**

> "I want to pay for MAP and get in immediately, without a confusing checkout or wondering if my payment went through."

---

# Desired Outcome

A creator can go from "signed up, unpaid" to "signed up, paid, unlocked" in one smooth flow, with no ambiguity about whether their payment succeeded. The founder can always answer "did this creator pay, and for what tier?" without checking Gumroad manually.

---

# Success Metrics

**Primary Metric:** % of signed-up creators who complete checkout (signup-to-paid conversion).

**Secondary Metrics:**
- Webhook processing success rate (target: near 100%, with retries for transient failures)
- Time from payment success to access granted (target: under 10 seconds)
- Duplicate-webhook incidents causing double-processing (target: zero, per idempotency requirement)
- Support requests related to "I paid but can't get in" (target: near zero)

---

# User Story

As a creator who has signed up,
I want to purchase MAP and be unlocked immediately,
so that I don't have to wonder whether my payment went through or contact support to get access.

---

# User Journey

**New Paying Creator — Happy Path**

Starting State: Creator has a verified MAP account (MAP-001) but has not purchased.
↓ Creator is shown a pricing/checkout screen (Starter / Pro / Creator+, per `pricing.md`)
↓ Creator selects a tier, redirected to Gumroad Checkout
↓ Creator completes payment on Gumroad
↓ Gumroad sends a webhook to MAP's API
↓ MAP verifies the webhook signature, timestamp, and product ID
↓ MAP records the transaction and creates/updates the creator's subscription record
↓ MAP grants access (unlocks protected routes beyond the paywall)
↓ Welcome/purchase-confirmation email triggered
↓ Creator is redirected back to MAP, now unlocked, proceeding to Onboarding (MAP-004)

**Migrated Creator — Free Access Path**

Starting State: Creator is one of the 20 accounts migrated in MAP-001 (FR11), flagged `migrated_from_manual = true`.
↓ Creator signs in via Magic Link (MAP-001, unchanged)
↓ MAP checks subscription status → finds `migrated_from_manual = true` → treats as entitled without a Gumroad transaction
↓ Creator proceeds directly to Onboarding (MAP-004), no checkout screen shown

**Failure Paths**

- Payment fails or is declined on Gumroad → creator sees Gumroad's own error, returns to MAP still unpaid, can retry.
- Webhook never arrives (network issue, Gumroad outage) → creator has paid but MAP doesn't know yet. Needs a reconciliation path (see Edge Cases).
- Webhook arrives but signature verification fails → request rejected and logged; access never granted from an unverified request.
- Webhook arrives more than once for the same purchase → processed exactly once (idempotent), no duplicate subscription records or duplicate emails.
- Creator closes the browser mid-checkout → no charge, no access change; they can restart checkout anytime.

---

# Functional Requirements

**FR1 (amended 2026-09-12 — see decision_log.md, "Freemium pivot")**
The system shall grant every new creator a Free tier by default upon signup, with no paywall blocking initial access. The pricing/upgrade screen (Starter, Pro, Creator+ per `pricing.md`) is shown contextually after the creator completes Onboarding (MAP-004) and experiences real value — not immediately after signup. Full contextual-trigger implementation is blocked on MAP-004; until then, Free-tier creators pass the access gate directly.

**FR2**
The system shall redirect the creator to Gumroad Checkout for the selected tier.

**FR3**
The system shall expose a webhook endpoint that receives Gumroad payment notifications.

**FR4**
The system shall verify every incoming webhook's signature before processing it, and reject unverified requests.

**FR5**
The system shall verify the product ID and purchase status on every webhook, and only grant access for a valid, completed purchase of a recognized MAP product/tier.

**FR6**
The system shall record every processed webhook by its unique webhook/purchase ID and skip reprocessing if that ID has already been handled (idempotency).

**FR7**
The system shall create or update a subscription record tied to the creator's account upon successful, verified payment.

**FR8**
The system shall grant access to protected routes only after a verified, active subscription exists for the creator, OR the creator is flagged `migrated_from_manual = true` (FR12).

**FR9**
The system shall trigger a purchase-confirmation email upon successful payment (via the Email Service, Resend).

**FR10**
The system shall log every webhook received (request ID, provider, result) without logging payment details or secrets, per `07_production_readiness.md`.

**FR11**
The system shall allow the founder to view a creator's payment/subscription status (tier, active/inactive, purchase date, or "free — migrated") for support purposes.

**FR12**
The system shall grant free, permanent access to any creator flagged `migrated_from_manual = true` (the 20 creators migrated in MAP-001), bypassing the paywall and Gumroad checkout entirely.

**FR13**
The system shall automatically revoke a creator's access when a verified refund or dispute webhook is received from Gumroad, setting their subscription status to `inactive` without requiring founder intervention.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Performance:** Webhook processing should complete within the Gumroad timeout window (10 seconds, per the integration timeout table in `system_architecture.md`); access should be granted within 10 seconds of a verified webhook.

**Security:** Webhook signature verification is mandatory on every request — no request is trusted without it. No payment card data ever touches MAP's servers (Gumroad handles PCI scope entirely). Secrets (Gumroad API keys/webhook secrets) are never logged.

**Reliability:** Webhook processing must be idempotent (FR6). If MAP's server is briefly down when a webhook arrives, Gumroad's own retry behavior should eventually succeed; MAP should not assume single delivery.

**Scalability:** Webhook volume is low at MVP scale; no special scaling considerations beyond standard API route handling.

**Maintainability:** The Payment Service interface must remain provider-agnostic enough that the planned Phase 2 migration to Stripe doesn't require rewriting the application layer — only the Gumroad-specific adapter is replaced. This is the same discipline the original AD-004 specified.

**Auditability:** Every transaction must be recorded (FR7) so the founder can reconstruct payment history without relying on Gumroad's dashboard alone.

---

# Acceptance Criteria

- Given an authenticated but unpaid creator (and not flagged `migrated_from_manual`), When they try to access a protected route beyond auth, Then they are shown the pricing/checkout screen instead.
- Given a creator selects a tier, When they complete checkout successfully on Gumroad, Then a webhook is received, verified, and access is granted within 10 seconds.
- Given a webhook arrives with an invalid or missing signature, When MAP processes the request, Then it is rejected and logged, and no access is granted.
- Given the same webhook is delivered twice (Gumroad retry), When MAP processes both, Then only one subscription record and one confirmation email result.
- Given a creator's payment succeeds, When the webhook completes processing, Then a purchase-confirmation email is sent via Resend.
- Given the founder looks up a creator, When they check payment status, Then they can see the creator's tier and active/inactive state (or "free — migrated") without needing to open Gumroad.
- Given a creator flagged `migrated_from_manual = true`, When they sign in, Then they are never shown the pricing/checkout screen.
- Given a verified refund or dispute webhook arrives for an active subscription, When MAP processes it, Then access is revoked automatically and the creator's next visit shows the paywall again, with no founder action required.

---

# UX Requirements

**Screens involved:** Pricing/tier selection screen, Gumroad-hosted checkout (external, not built by MAP), a "processing payment" waiting state on return from Gumroad, a "payment confirmed, welcome" screen, an error/retry state if the webhook hasn't arrived yet when the creator returns.

**States:** Loading (waiting for webhook confirmation after checkout return), Empty (no subscription yet — shown the pricing screen), Error (payment failed, webhook rejected), Pending (paid on Gumroad's side but MAP hasn't received confirmation yet — should not falsely tell the creator they're unlocked, nor leave them stuck without guidance).

**Accessibility considerations:** Pricing tiers presented as clear, comparable options (not just prose); checkout redirect clearly signposted as leaving MAP for Gumroad.

---

# AI Requirements

Does this feature use AI? **No.**

Payment processing is intentionally deterministic and provider-managed (Gumroad), consistent with the Non-AI Responsibilities list in `system_architecture.md` (Payments is explicitly listed as a non-AI responsibility).

---

# Data Requirements

**New database tables:** `subscriptions` — tied to `creator_profiles`, storing tier, status (active/inactive/canceled), Gumroad purchase/subscription ID, purchased_at. Designed so Phase 2 (Stripe) can reuse this table, adding Stripe-specific ID fields, without a structural rewrite.

**New database table:** `processed_webhooks` — stores webhook ID and processed timestamp, used solely for idempotency checks (FR6).

**Existing tables:** `creator_profiles` (from MAP-001) — referenced via foreign key, not modified.

**Relationships:** `subscriptions.creator_id` → `creator_profiles.id`.

**Events emitted:** `payment.webhook_received`, `payment.verified`, `payment.rejected`, `subscription.created`, `subscription.updated`.

**Analytics tracked:** Checkout started, checkout completed (via webhook), webhook rejected (with reason), tier selected.

**Data retention:** Transaction records retained indefinitely for accounting/support purposes.

**Privacy implications:** No card data stored by MAP (Gumroad-hosted checkout). Purchase amount and tier are stored; standard business record-keeping.

---

# API Requirements

**Endpoints:**
```
POST /api/webhooks/gumroad      — receives Gumroad payment notifications
GET  /api/subscription/status   — returns the current creator's subscription status
```

**Inputs:** Gumroad webhook payload (POST); session cookie (GET, for the authenticated creator's own status).

**Outputs:** 200 acknowledgment to Gumroad on successful processing (including already-processed duplicates); subscription status JSON for the GET endpoint.

**Authentication:** Webhook endpoint authenticates via Gumroad's signature scheme (not a user session). Status endpoint requires an authenticated session.

**Rate limits:** Not expected to be a concern at MVP webhook volume.

**Versioning:** Not versioned at MVP stage.

---

# Edge Cases

- Creator pays but the webhook is delayed or lost entirely (Gumroad outage, network issue) → founder needs a manual reconciliation path (look up the purchase in the Gumroad dashboard and manually mark a creator as paid) until an automated retry/reconciliation job exists.
- Creator disputes/refunds a payment → Gumroad sends a refund/dispute webhook (per FR13); MAP verifies it and automatically revokes access, no founder action required. If the webhook itself fails to arrive (rare, but possible per the same reliability caveats as the purchase webhook), the founder's manual Gumroad-dashboard check (see Edge Cases below on missed webhooks) serves as the fallback — automation is primary, manual review is backup only.
- Creator already has an active subscription and tries to check out again → should not create a duplicate subscription.
- Webhook arrives for a creator email that doesn't match any existing MAP account → log and flag for manual review rather than silently discarding.
- A creator flagged `migrated_from_manual = true` later completes a real Gumroad purchase → migrated flag should not block this; treat as their entry into a real paid subscription going forward.

---

# Risks

**Technical Risks:** Dependence on Gumroad webhook reliability. Mitigation: clear "processing" state in the UI, plus a manual founder reconciliation path.

**Product Risks:** A confusing checkout-to-unlock gap could generate support burden right after payment. Mitigation: honest "processing" messaging.

**Business Risks:** This feature gates all revenue. Mitigation: webhook signature verification and idempotency are non-negotiable, not nice-to-haves.

**User Experience Risks:** Leaving MAP for an external checkout page can feel jarring. Mitigation: clear signposting, fast return flow.

**Migration Risk (new in this version):** Building on Gumroad now means a real Phase 2 migration effort later (new provider adapter, re-pointing checkout, re-testing webhooks). Accepted tradeoff for shipping revenue capability now rather than waiting on US entity registration.

---

# Alternatives Considered

- **Stripe now** — rejected for this phase; blocked on MAP being registered as a US entity (Stripe does not support direct Nigerian-registered businesses or payouts to Nigerian banks). Remains the Phase 2 target.
- **Manual payment via Grey** — considered and rejected; Grey is a multi-currency receiving account, not a checkout/webhook API, and a fully manual process doesn't scale even as a stopgap.
- **Grey as an automated gateway** — investigated directly; no evidence Grey offers a developer API for checkout or subscription billing, so this wasn't viable regardless of preference.
- **Manual/founder-invoiced payment only (general)** — rejected; doesn't scale past the current manually-onboarded creators and blocks self-serve growth.
- **Grant access before webhook confirmation (optimistic unlock)** — rejected; the architecture is explicit that access is never granted until webhook verification succeeds.

---

# Dependencies

**Internal dependencies:** MAP-001 (User Authentication) — complete, verified.

**External services:** Gumroad (checkout, webhooks), Resend (purchase-confirmation email, already integrated).

**APIs:** Gumroad Checkout API, Gumroad Webhook payload.

**Infrastructure:** A new protected-route gate that checks subscription status in addition to the auth check already in place from MAP-001's middleware.

**Feature flags:** None required at MVP.

**Future dependency (Phase 2, tracked not built here):** MAP registered as a US entity → Stripe account setup → automated migration from Gumroad to Stripe.

---

# Out of Scope

- Multiple simultaneous subscriptions or add-ons.
- Proration, upgrades/downgrades between tiers.
- Stripe integration — Phase 2, blocked on US entity registration.
- Grey integration of any kind — evaluated, not viable as an automated gateway.
- Automated refund/dispute handling beyond basic access revocation.
- Tax handling/invoicing beyond what Gumroad provides natively.

---

# Rollout Strategy

**Internal testing:** Founder completes a real checkout in Gumroad's test/sandbox mode (or a real low-cost purchase) and verifies the full flow end-to-end.

**Alpha:** Enable for new signups only. The 20 already-migrated creators retain free access (FR12).

**Beta:** Open checkout to all new creators from the waitlist.

**Public release:** Bundled with MAP-001, since a creator can now sign up, pay, and be unlocked as one continuous flow.

**Success criteria per phase:** Zero unverified-webhook access grants (hard requirement); checkout completion rate tracked from day one.

**Rollback plan:** If Gumroad webhook delivery proves unreliable, fall back to founder manually verifying payments in the Gumroad dashboard.

**Transition to Phase 2:** Once the US entity and Stripe account are ready, a follow-up PRD specifies the Gumroad→Stripe migration, reusing the `subscriptions` table structure where possible.

---

# Documentation Updates

- `system_architecture.md` — restore/update AD-004 to reflect Gumroad as Phase 1, Stripe as the documented Phase 2 target once the US entity exists. Update §23 Payment Flow to name Gumroad.
- `decision_log.md` — record the full path this decision took (Gumroad → Stripe → manual/Grey → back to Gumroad-as-Phase-1) and why, so the reasoning isn't lost.
- `mvp_backlog.md` — update MAP-002 status once approved.
- `known_issues.md` — log the manual-reconciliation gap (missed webhook path) as a known limitation.

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| Should the 20 already-migrated creators be retroactively charged, grandfathered free, or offered a founding-member rate? | Founder | High | **Resolved — free, permanent access (FR12)** |
| Is Stripe the confirmed Phase 2 target once US registration is complete? | Founder | High | **Resolved — yes** |
| Should Grey be used for payments in any form? | Founder | High | **Resolved — no, not viable as an automated gateway; not used for manual payments either, given Gumroad covers Phase 1** |
| How should MAP handle Gumroad refund/dispute webhooks for MVP — full automated revocation, or manual founder review? | Founder | Medium | **Resolved — automated revocation (FR13), manual Gumroad-dashboard check as fallback only** |
| Does Gumroad support the exact three-tier structure in `pricing.md` (Starter/Pro/Creator+) as separate products, or as variants of one? | Engineering | Medium | Open |

---

# Reviewer Checklist

- [x] The problem is clearly defined.
- [x] The solution addresses the problem.
- [x] Success metrics are measurable.
- [x] Functional requirements are complete.
- [x] Acceptance criteria are testable.
- [x] Edge cases have been considered.
- [x] Risks have been documented.
- [x] Documentation updates are identified.
- [x] Product Principles are respected.
- [x] Engineering Principles are respected.
- [x] Architecture Principles are respected.

---

# Founder Decision

**Decision:** Approved

**Reasoning:** Gumroad ships now with no blocking prerequisite, restores the original AD-004 architecture, and the Payment Service interface stays provider-agnostic so the planned Phase 2 migration to Stripe (once MAP is a US entity) doesn't require an application-layer rewrite. Manual payment via Grey was properly evaluated and correctly ruled out — Grey isn't a checkout API. Free access for the 20 migrated creators (FR12) and automated refund/dispute revocation (FR13) are both specified.

**Date:** 2026-09-06

**Owner:** Founder

---

# Post-Launch Review

_To be completed after release._

---

# MAP Product Principles Validation

**Does this feature reduce cognitive load?**
Yes, when the webhook-to-unlock gap is fast and clearly communicated.

**Does it help users take meaningful action?**
Indirectly — it's the gate, not the action itself.

**Does it protect momentum?**
Yes, when instant; fails this principle if the gap between paying and unlocking is left unclear.

**Does it respect different levels of time and energy?**
Not strongly applicable — one-time transactional flow.

**Is it simpler than the alternative?**
Yes relative to building against a Grey-based manual system with its own tracking overhead, and available now, unlike Stripe.

**Final Question — If this feature did not exist, would users be significantly less likely to make progress?**
Yes — without it, MAP has no revenue mechanism.

---

# MAP Philosophy Check

This feature should leave users feeling: *"I know exactly what to do next."*

Applied here: a creator should feel *"I paid, and now I'm in — no waiting, no wondering."*