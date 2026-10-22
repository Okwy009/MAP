# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0006 — Decision Engine MVP

**Related PRD:** PRD-0006 / MAP-005

**Related Backlog Item:** MAP-005 — Decision Engine MVP

**Author:** MAP OS (Engineer Mode)

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Closed — Superseded by MAP-005 v2 (PRD-0007)

**Target Release:** v0.1.0

---

# Scope Summary

Builds a deterministic, ordered rule-evaluation engine that reads a creator's profile and returns exactly one recommendation, exposed via `GET /api/recommendation` and rendered on the existing `/today` placeholder route. Two rules for MVP: onboarding-incomplete, and the "today's post" fallback. Architected so future rules (task-resume, energy-based, Recovery Mode) can be added as new rule modules without touching existing ones.

---

# Architecture Review

**Technical feasibility:** Low-moderate risk. Pure logic over already-available data — no external API calls, no new database writes.

**Design pattern:** Ordered rule list, first-match-wins. Each rule is a self-contained module with a `matches(profile)` check and a `generate(profile)` function. This is the extensibility point FR8 requires — a new rule is a new file plus one line registering it in the engine's rule order, not a change to existing logic.

**Dependencies:** `profiles` table (MAP-003/004) — no schema changes needed, purely reads existing columns.

---

# Technical Tasks

1. **Types** — `types/recommendation.ts`: `Recommendation { title, description, estimatedDuration, reason, successCriteria }`.
2. **Rule interface** — `services/decision-engine/rule.ts`: defines the `Rule` interface (`id`, `matches(profile): boolean`, `generate(profile): Recommendation`).
3. **Rule: onboarding incomplete** — `services/decision-engine/rules/onboarding-incomplete.ts`: matches when `onboarding_complete === false`. Generates a recommendation pointing back to the Tally form / onboarding checklist rather than a content task.
4. **Rule: today's post (fallback)** — `services/decision-engine/rules/todays-post.ts`: always matches (the fallback/default rule, last in the order). Generates the "write today's post" recommendation using `platform`, `focus_area`, `tone`, `posting_frequency_type`. Handles missing/sparse fields gracefully (e.g., generic phrasing if `tone` is null) rather than producing broken output.
5. **Engine** — `services/decision-engine/engine.ts`: holds the ordered rule list, runs `matches()` in order, returns the first match's `generate()` output. Pure function, no I/O — takes a profile object, returns a `Recommendation`.
6. **API route** — `app/api/recommendation/route.ts`: `GET`, session-authenticated, fetches the caller's profile (reusing `profile.repository.ts` from MAP-003), runs it through the engine, returns the recommendation as JSON.
7. **Rebuild `/today`** — `app/(dashboard)/today/page.tsx`: replace the placeholder cards with a real fetch to `/api/recommendation` and render title, description, estimated duration, reason, success criteria. No "Complete" button (deferred to MAP-008, per Founder decision).

---

# File Changes

```
types/
  recommendation.ts

services/
  decision-engine/
    rule.ts
    engine.ts
    rules/
      onboarding-incomplete.ts
      todays-post.ts
    README.md

app/
  api/
    recommendation/
      route.ts
  (dashboard)/
    today/
      page.tsx          # rewritten, not new
```

---

# Rule Logic Detail

**Rule 1 — Onboarding Incomplete** (checked first)
- Matches: `onboarding_complete === false`
- Output: title "Finish setting up your profile," description pointing to the onboarding checklist, reason "MAP needs to know your platform and focus to give you real recommendations."

**Rule 2 — Today's Post** (fallback, always matches)
- Uses `platform`, `focus_area`, `tone`, `posting_frequency_type` to construct the recommendation, per PRD-0006's worked example.
- Missing-field handling: if `tone` is null, omit the tone phrase rather than saying "in your null tone." If `platform` is null, use generic phrasing ("your platform" rather than naming one). Never produces broken/awkward output regardless of how sparse the profile is.
- Fixed estimated duration for MVP (15–20 minutes) — not yet varied by `posting_frequency_count`; a reasonable simplification, revisit later if needed.

---

# API Endpoints

| Endpoint | Auth Required | Notes |
|---|---|---|
| `GET /api/recommendation` | Session cookie | Returns the caller's current recommendation; no caching, regenerated fresh each call |

---

# Testing Requirements

**Unit tests:** Each rule tested in isolation — `matches()` and `generate()` against various profile shapes (complete profile, sparse/minimal profile, onboarding incomplete). Engine tested for correct rule ordering (onboarding-incomplete rule wins when applicable, fallback otherwise).

**Manual QA:** Founder's own real test profile (already in the database) used to confirm the actual rendered `/today` page matches the PRD's worked example in tone and usefulness — not just structurally correct.

---

# Rollout Plan

**Internal testing:** Verify against multiple real profiles already in the database — the founder's own test account (fully onboarded), and spot-check what a sparse migrated-creator profile would produce (without actually needing them to log in).

**Rollback plan:** If the recommendation logic needs rework, `/today` can revert to its placeholder state trivially — no data migrations involved, purely additive code.

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-005)
- [x] PRD approved (PRD-0006)
- [x] Architecture reviewed
- [x] Implementation Package approved
- [x] Dependencies resolved (MAP-003, MAP-004 complete)
- [x] Acceptance criteria complete (inherited from PRD-0006)

---

# Founder / Engineering Decision

**Decision:** Superseded

**Superseded by:** PRD-0007 — MAP-005 v2: AI-Driven 30-Day Content Calendar (2026-09-13)

**Reasoning for supersession:** This document scoped a simple, deterministic rule-based recommendation engine ("today's post"). Direct investigation of the founder's real, already-operating content system (the content-nudge-calendar and notion-post-drafter skills, and the live Notion "Content Master" schema) revealed the actual product has always been AI-driven — a 6-pillar, value-ladder content strategy with strict anti-fabrication rules, generating a full 30-day calendar, not one recommendation at a time. This PRD/IP undershot the real product and is fully replaced, not extended.

**Decision:** Approved

**Reasoning:** Ordered, first-match-wins rule design gives real extensibility for the deferred rules (task-resume, energy, Recovery Mode) without requiring a rewrite later. Missing-field handling ensures sparse profiles (several of the 20 migrated creators) still produce coherent output. No new database writes, no external dependencies, purely additive to /today.

**Date:** 2026-09-13

**Owner:** Founder