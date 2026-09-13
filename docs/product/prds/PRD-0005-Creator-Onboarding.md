# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-004 — Creator Onboarding

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Approved

---

# Executive Summary

MAP-004 collects real creator context via an existing, already-battle-tested Tally form (the same intake structure used to manually onboard the 20 migrated creators), rather than a custom-built in-app form. Answers flow into MAP via a Tally webhook — the same integration pattern already proven with Gumroad in MAP-002 (unauthenticated webhook, verified against real payload data before trusting it). Rather than gating dashboard access on completion, a persistent onboarding checklist shows creators their completion percentage and what's missing, encouraging completion without blocking. Migrated creators are reached separately, via email, not the in-app flow.

This PRD also identifies and scopes a schema gap: MAP-003's original 9-field profile schema undershoots what the real Tally form actually collects. A follow-up migration under this PRD adds the missing fields.

---

# Problem Statement

- **What problem exists?** MAP-003 built a schema and API for creator context, but nothing collects real answers yet — and the schema itself is incomplete relative to the actual intake form already in use.
- **Who experiences it?** Every new creator, and the 20 migrated creators whose profiles are still empty.
- **Why is it important?** The Decision Engine (MAP-005) needs this data to generate anything personalized.
- **How is this solved today?** Manually, by the founder, using this same Tally form, one creator at a time.

---

# Customer

**Primary User:** A new creator, prompted to complete their profile via the checklist after signing up.

**Secondary User:** One of the 20 migrated creators, reached via email rather than in-app prompting.

**Jobs To Be Done:**

> "I want to tell MAP about my content and goals in the same form I'm used to, and see clearly what's left before it's done."

---

# Desired Outcome

A creator fills out the existing Tally form (linked from MAP, not rebuilt inside it), and their answers appear in their MAP profile automatically. A persistent checklist on the dashboard shows their completion percentage and what's still missing, without blocking access to anything.

---

# Success Metrics

**Primary Metric:** % of creators who reach 100% profile completion within their first week.

**Secondary Metrics:** Tally-to-MAP webhook success rate (target: near 100%, same rigor as Gumroad's); checklist engagement (do creators actually click through from the checklist to the form).

---

# User Story

As a creator,
I want to fill out the same intake form used to onboard MAP's early creators, and see my progress toward a complete profile,
so that MAP can eventually give me relevant recommendations, without feeling forced to finish it all at once.

---

# User Journey

**New Creator — Happy Path**

Creator signs up (MAP-001) → reaches dashboard (already unblocked, per freemium model)
↓ Sees an onboarding checklist widget: "Profile X% complete" + a link to the Tally form
↓ Clicks through, fills out the Tally form (external, not rebuilt in MAP)
↓ On submission, Tally sends a webhook to MAP
↓ MAP verifies the webhook, maps answers to profile fields, updates the creator's row
↓ Checklist updates to reflect new completion percentage; once all fields are filled, `onboarding_complete = true`

**Migrated Creator Path**

Founder triggers (or a one-time script sends) an email to each of the 20 migrated creators
↓ Email invites them to visit their MAP dashboard and complete their profile
↓ From there, same checklist/Tally flow as any other creator

**Failure Paths**

- Webhook fails to arrive or fails verification → same reconciliation pattern as Gumroad: log it, don't silently drop it, founder can check Tally's own submission log as a fallback source of truth.
- Creator fills out the Tally form twice (re-submits) → later submission should update, not duplicate, their profile.

---

# Functional Requirements

**FR1**
The system shall display a persistent onboarding checklist on the dashboard, showing completion percentage based on how many of the (updated) profile fields are filled.

**FR2**
The checklist shall never block access to any dashboard route — it is a nudge, not a gate.

**FR3**
The system shall expose a webhook endpoint that receives Tally form submissions.

**FR4 (resolved 2026-09-13)**
The system shall verify each incoming Tally webhook by confirming the payload's `formId` matches the known onboarding form ID (`zxjJMR`) before trusting its data. A cryptographic signing secret was investigated directly against the live Tally integration and found unavailable/not functioning on the current plan — logged as a known limitation, not blocking. This is a deliberately lower security bar than Gumroad's webhook (MAP-002), acceptable because onboarding data carries no financial risk — the worst case of a forged submission is incorrect profile data, not fraud.

**FR5**
The system shall map incoming Tally answers to the correct profile fields (mapping confirmed against a real Tally payload before being finalized in code).

**FR6**
The system shall match an incoming submission to the correct MAP creator via their email address (same pattern as Gumroad's buyer-email matching in MAP-002).

**FR7**
The system shall treat a second submission from the same creator as an update, not a duplicate — overwriting previous answers rather than creating conflicting data.

**FR8**
The system shall set `onboarding_complete = true` once all required fields are populated.

**FR9**
The system shall NOT show the in-app checklist/prompt flow to the 20 migrated creators through automated in-app triggers — they are reached via a separate, one-time email instead.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Security:** Same discipline as the Gumroad webhook — verify authenticity before trusting the payload, never blindly write incoming data to the database.

**Reliability:** Webhook processing should be idempotent, same as Gumroad's `processed_sales` pattern — a resubmitted or retried webhook must not create duplicate or corrupted state.

**Data integrity:** Partial submissions (if Tally allows saving progress) should update only the fields provided, consistent with MAP-003's existing partial-update semantics.

---

# Acceptance Criteria

- Given a creator submits the Tally form, When the webhook is received and verified, Then their profile is updated with the submitted answers within a reasonable time (target: under 10 seconds, matching the Gumroad webhook's SLA).
- Given a creator has not completed their profile, When they view the dashboard, Then they see a checklist showing their completion percentage — and can still access every other dashboard feature.
- Given all required fields are filled, When the last webhook is processed, Then `onboarding_complete` becomes true.
- Given a creator resubmits the form, When the second webhook arrives, Then their profile is updated, not duplicated.
- Given a migrated creator, When MAP-004 ships, Then they receive an email (not an automated in-app prompt) inviting them to complete their profile.

---

# UX Requirements

**Screens involved:** A checklist widget on the dashboard (percentage + missing items list), linking out to the external Tally form. No in-app form is built.

**Tone:** The Tally form's existing copy ("You're not filling a form. You're entering a 30-day execution system") is strong, on-brand, and should be preserved as-is — no changes proposed here.

---

# AI Requirements

Does this feature use AI? **No.**

---

# Data Requirements

**Schema gap identified — new migration required.** The following fields exist in the real Tally form but not in MAP-003's current schema:

| New field | Type | Source |
|---|---|---|
| `subscriber_count` | integer, nullable | "How many subscribers do you have?" |
| `priority_platform` | text, nullable | "Which ONE platform to prioritize?" |
| `profile_link` | text, nullable | "Link to your Profile?" |
| `posting_frequency_type` | text, nullable | Daily/Weekly/Custom |
| `posting_frequency_count` | integer, nullable | "How many Posts/Notes?" |
| `newsletter_cadence` | text, nullable | Daily/Weekly/Monthly |
| `newsletter_days` | text, nullable | "Insert day(s)" |
| `start_date` | date, nullable | "When would you like to begin?" |
| `desired_impact` | text, nullable | "What would it change for you?" (distinct from `primary_goal`) |
| `newsletter_consent` | boolean, not null, default false | "OK sharing responses on our Newsletter?" |

**Type change:** `ai_preference` changes from `text` to `boolean` — the real form only offers Yes/No.

**Existing fields reused as-is:** `creator_type`, `platform`, `audience`, `focus_area` (topics), `tone`, `review_cadence`, `primary_goal` (mapped from "what would success look like in 30 days").

**New table, possibly:** `processed_tally_submissions` — idempotency tracking, mirroring `processed_sales` from MAP-002, keyed by Tally's submission ID.

---

# API Requirements

**Endpoints:**
```
POST /api/webhooks/tally   — receives Tally form submission webhooks
GET  /api/profile/completion — returns completion percentage + missing fields (for the checklist)
```

**Exact verification mechanism for FR4** — to be confirmed once Tally's webhook configuration screen is inspected directly (signing secret, header-based token, or similar — not assumed).

---

# Edge Cases

- A creator's email in the Tally submission doesn't match any MAP account → log and flag for manual review, same pattern as Gumroad's `no_matching_account`.
- Tally allows an "Other (please specify)" answer on the platform question → stored as free text in `platform`, no special handling needed.

---

# Risks

**Technical Risk:** Exact Tally webhook payload/verification structure isn't yet confirmed — flagged as an explicit engineering task before FR4/FR5 are finalized in code, not guessed at here.

**Product Risk:** A non-blocking checklist could be easy to ignore. Mitigation: make the checklist visible and specific ("3 of 12 done — add your posting cadence") rather than vague.

---

# Alternatives Considered

- **Build a native in-app onboarding form** — rejected; the Tally form already exists, already works, and is already the form used to onboard the 20 migrated creators. Rebuilding it natively would be pure duplication.
- **Mandatory, blocking onboarding** — rejected in favor of the checklist model, per Founder decision.
- **Prompt migrated creators in-app** — rejected in favor of email, per Founder decision; their access is already unrestricted, so an in-app nag isn't the right trigger.

---

# Dependencies

**Internal dependencies:** MAP-003 (Creator Profile) — complete, but needs the follow-up migration described above.

**External dependencies:** The existing Tally form (https://tally.so/r/zxjJMR) and its webhook configuration.

**Blocks:** MAP-005 (Decision Engine) needs this data to function meaningfully.

---

# Out of Scope

- Rebuilding the Tally form natively in MAP.
- Any Decision Engine logic (MAP-005).
- Automated in-app reminders for migrated creators (explicitly email-only, per Founder decision).

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| Exact Tally webhook payload structure and verification method | Engineering | High | **Resolved — real payload captured via webhook.site; formId-based verification adopted as fallback (see FR4)** |
| Should `newsletter_consent = true` actually connect to a real newsletter, or just be stored for now? | Founder | Low | Open |
| Exact wording/timing of the migrated-creator reminder email | Founder | Medium | Open |

---

# Founder Decision

**Decision:** Approved

**Reasoning:** Reuses the existing, already-proven Tally form rather than duplicating it in-app; correctly identifies and scopes the schema gap discovered by inspecting a real payload rather than guessing; the non-blocking checklist model fits MAP's cognitive-load principle better than a hard gate; the lower-security webhook verification (formId match, no signature) is an explicit, logged, and reasonable tradeoff given the data carries no financial risk.

**Date:** 2026-09-13

**Owner:** Founder
