# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0005 — Creator Onboarding (Tally Integration + Checklist)

**Related PRD:** PRD-0005 / MAP-004

**Related Backlog Item:** MAP-004 — Creator Onboarding

**Author:** MAP OS (Engineer Mode)

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Approved

**Target Release:** v0.1.0

---

# Scope Summary

Adds the missing profile columns (schema gap identified in PRD-0005), builds a webhook receiver for real Tally submissions (verified against a real captured payload, mapping confirmed field-by-field), and a non-blocking checklist widget on the dashboard. No native onboarding form is built — the existing Tally form is the UI.

---

# Architecture Review

**Technical feasibility:** Low-moderate risk. Mapping logic is more involved than Gumroad's (19+ fields vs. one tier lookup), but each step is well-understood from the real captured payload — no guessing involved.

**Security:** Lower trust bar than Gumroad's webhook, deliberately (see PRD-0005 FR4) — verified by `formId` match only, no cryptographic signature (unavailable on current Tally plan). Logged as a known limitation.

**Dependencies:** MAP-003's `profiles` table (needs the new migration below) and existing partial-update repository pattern.

---

# Technical Tasks

1. **Migration** — `supabase/migrations/000006_add_onboarding_fields.sql`: add `subscriber_count` (integer), `priority_platform` (text), `profile_link` (text), `posting_frequency_type` (text), `posting_frequency_count` (integer), `newsletter_cadence` (text), `newsletter_days` (text, nullable — conditional field, may be absent), `start_date` (date), `desired_impact` (text), `newsletter_consent` (boolean, default false). Alter `ai_preference` from text to boolean.
2. **Tally domain service** — `services/onboarding/tally-domain-service.ts`: pure mapping logic. Takes the raw `fields` array, resolves multi-choice/checkbox option IDs to their text label (per the captured payload's `options` arrays), treats `"n/a"` as unanswered (→ `null`), ignores the redundant per-option `question_X_optionId` boolean entries, returns a clean field-mapped object.
3. **Tally client/verification** — `services/onboarding/tally-verify.ts`: confirms `data.formId === "zxjJMR"` before trusting anything (FR4's fallback approach). No signature check (unavailable, logged).
4. **Webhook receiver** — `app/api/webhooks/tally/route.ts`: POST, parses JSON body, verifies formId, extracts email from `question_zDVXPk`, matches to a MAP creator via the existing email-lookup pattern from `creator.repository.ts` (MAP-002), calls the domain service, persists via `profile.repository.ts`'s existing partial-update logic (MAP-003).
5. **Idempotency** — `processed_tally_submissions` table, keyed by `data.submissionId`, mirroring `processed_sales`' pattern from MAP-002. A resubmission with the same `submissionId` updates rather than duplicates (per FR7); a genuinely new submission from the same creator (different `submissionId`, matched by email) also updates their existing profile row rather than creating a second one.
6. **Completion percentage endpoint** — `GET /api/profile/completion`: counts how many of the tracked onboarding fields are non-null, returns a percentage + list of missing field labels.
7. **Checklist UI component** — `components/onboarding/OnboardingChecklist.tsx`: displays percentage + missing items, links out to the Tally form URL, rendered on the dashboard. Never blocks navigation (FR2).
8. **Set `onboarding_complete`** — once all required fields are non-null, set to `true` as part of the webhook-processing step (task 4).

---

# File Changes

```
supabase/
  migrations/
    000006_add_onboarding_fields.sql

services/
  onboarding/
    tally-domain-service.ts
    tally-verify.ts
    README.md

app/
  api/
    webhooks/
      tally/
        route.ts
    profile/
      completion/
        route.ts

repositories/
  processed-tally-submission.repository.ts

components/
  onboarding/
    OnboardingChecklist.tsx

types/
  onboarding.ts
```

---

# Field Mapping (confirmed against real captured payload)

| Tally key | MAP field | Handling |
|---|---|---|
| `question_8Q9o7l` + `question_064rN9` | `full_name` | Concatenate first + last |
| `question_zDVXPk` | *(email match, not stored)* | Lookup creator by email |
| `question_XWj5BO` | `creator_type` | Resolve option ID → text; `"n/a"` → null |
| `question_P0GXL0` | `subscriber_count` | Parse int; `"n/a"` → null |
| `question_8Q9NpA` | `platform` | Resolve option ID(s) → text |
| `question_064VjZ` | `priority_platform` | Direct; `"n/a"` → null |
| `question_lWlOLo` | `profile_link` | Direct |
| `question_zDVEQ1` | `focus_area` (topics) | Direct; `"n/a"` → null |
| `question_51NXqM` | `audience` | Direct; `"n/a"` → null |
| `question_DdLqvb` | `primary_goal` | Direct; `"n/a"` → null |
| `question_P5oRBQ` | `posting_frequency_type` | Resolve option ID → text |
| `question_ze1QVZ` | `posting_frequency_count` | Parse int; `"n/a"` → null |
| `question_rEkdRL` | `newsletter_cadence` | Direct text; `"n/a"` → null |
| `question_xZl0Yy` | `ai_preference` (bool) | `true` iff "Yes" option ID present |
| `question_xyNJpG` | `start_date` | Direct (ISO format) |
| `question_lNPB0B` | `tone` | Direct; `"n/a"` → null |
| `question_R5OWBp` | `review_cadence` | Resolve option ID → text |
| `question_oMJ9VX` | `desired_impact` | Direct; `"n/a"` → null |
| `question_GdMeB2` | `newsletter_consent` (bool) | `true` iff "Yes (Share)" ID present |

**Ignored entirely:** all `question_X_optionId: true/false` redundant per-option entries.

---

# Testing Requirements

**Unit tests:** Domain service mapping logic — every field above, including `"n/a"` → null handling and option-ID resolution, tested against the real captured payload (both test submissions already captured this session can serve as fixtures).

**Integration tests:** Full webhook flow — formId verification rejects wrong form IDs; idempotency on repeated `submissionId`; email-not-matched case logs and doesn't error.

**Manual QA:** One more real Tally submission, this time pointed at the actual MAP endpoint (not webhook.site), confirming a real creator's profile updates correctly end-to-end.

---

# Rollout Plan

1. Apply migration 000006.
2. Deploy the webhook endpoint.
3. **Switch Tally's webhook URL from webhook.site to the real MAP endpoint** — critical, easy to forget.
4. Submit one real test through the live endpoint, confirm the profile updates.
5. Add the checklist component to the dashboard.
6. Draft and send the migrated-creator reminder email (separate, small task — copy needs Founder review before sending to real people).

**Rollback plan:** Additive migration only; webhook endpoint can be disabled in Tally without affecting anything else if something's wrong.

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-004)
- [x] PRD approved
- [x] Architecture reviewed
- [x] Implementation Package approved
- [x] Dependencies resolved (MAP-003 complete)
- [x] Acceptance criteria complete (inherited from PRD-0005)

---

# Founder / Engineering Decision

**Decision:** Approved

**Reasoning:** Field mapping is verified against real captured Tally payloads, not assumed. Reuses existing repository/API patterns from MAP-002 and MAP-003 (idempotency, partial-update, email matching) rather than inventing new ones. Scope is well-bounded — no native form, no new UI beyond a checklist widget.

**Date:** 2026-09-13

**Owner:** Founder
