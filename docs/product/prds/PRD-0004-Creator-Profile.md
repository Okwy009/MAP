# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-003 — Creator Profile

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-12

**Version:** 1.0

**Status:** Approved

---

# Executive Summary

MAP's `profiles` table (created in MAP-001) currently only holds basic account fields — `full_name`, `avatar_url`, `username`. It has nowhere to store the actual creator context the Decision Engine will eventually need to generate a meaningful recommendation: what platform they publish on, what they're trying to achieve, their tone, their cadence. This PRD scopes the data model extension and basic read/update capability only — **not** the onboarding flow that collects this data (that's MAP-004, built next, deliberately kept separate per Founder decision on sequencing).

---

# Problem Statement

- **What problem exists?** There is no structured place to store the creator context (platform, goals, tone, cadence, etc.) that every downstream feature — Onboarding, the Decision Engine, the 30-Day Plan — depends on.
- **Who experiences it?** Every creator, indirectly — nothing personalized can be built until this exists.
- **Why is it important?** Per `system_architecture.md`, the Creator Profile is a core domain object; the Decision Engine's entire input pipeline starts with it. Nothing in MAP-005 onward is buildable without this first.
- **How is this solved today?** It isn't — only auth-level fields exist.

---

# Customer

**Primary User:** The system itself, and future features (Onboarding, Decision Engine) that need to read/write this data. This is infrastructure, not a creator-facing feature on its own.

**Secondary User:** The founder, who may want to inspect/correct a creator's profile data directly for support purposes (same pattern as the MAP-002 founder-lookup query).

---

# Desired Outcome

A `creator_profiles`-equivalent data model exists (extending the current `profiles` table, not replacing it — same table, new columns, to avoid an unnecessary join for every request) with fields for the context described in `system_architecture.md` §24, plus a basic, secure way to read and update it — ready for MAP-004's onboarding flow to populate, and MAP-005's Decision Engine to consume.

---

# Success Metrics

**Primary Metric:** Schema exists, is RLS-protected correctly (creators can only read/write their own profile), and successfully stores/retrieves a full set of test data.

**Secondary Metrics:** Zero data loss on update; correct rejection of writes to another creator's profile (RLS verification, same rigor as MAP-001's `subscriptions` table).

---

# Functional Requirements

**FR1**
The system shall extend the `profiles` table with columns for: creator type, platform (e.g. Substack, blog, newsletter — text field, not a rigid enum, since platforms will expand), audience description, content topics, tone, publishing cadence, primary goal, AI-assistance preference, and review cadence.

**FR2**
The system shall allow a creator to update their own profile fields via an authenticated request.

**FR3**
The system shall allow a creator to read their own full profile.

**FR4**
The system shall enforce Row-Level Security so a creator can only read/write their own profile row — never another creator's.

**FR5**
The system shall track whether a profile is "complete" (i.e., has been through onboarding) via a boolean flag, so MAP-004 and future features can distinguish a fully-onboarded creator from one who hasn't finished yet.

**FR6**
The system shall leave all new fields nullable, since no data exists for any current creator (including the 20 migrated ones) until MAP-004 collects it.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Security:** Same RLS discipline as every other table this session — no public exposure of one creator's data to another, verified by an explicit test, not just assumed from the policy existing.

**Maintainability:** Extends the existing `profiles` table rather than creating a parallel `creator_profiles` table, to avoid an unnecessary join on every authenticated request (auth data and profile data already live together).

**Data integrity:** No destructive migration — this only adds nullable columns; nothing existing is altered or at risk.

---

# Acceptance Criteria

- Given a fresh migration is applied, When the `profiles` table is inspected, Then it contains all fields listed in FR1, all nullable.
- Given a creator makes an authenticated request to update their own profile, When the request completes, Then their profile reflects the new values.
- Given a creator attempts to read or write another creator's profile row, When the request is made, Then it is rejected by RLS.
- Given a creator has not yet completed onboarding, When their profile is checked, Then the "complete" flag reads false.

---

# UX Requirements

None — this PRD has no UI. The onboarding form that actually collects this data is MAP-004.

---

# AI Requirements

Does this feature use AI? **No.** Pure data storage; the Decision Engine that later reads this data is a separate, future feature (MAP-005).

---

# Data Requirements

**Modified table:** `profiles` — add columns: `creator_type` (text, nullable), `platform` (text, nullable), `audience` (text, nullable), `topics` (text, nullable — free text for MVP; may normalize to an array/tags table later if needed), `tone` (text, nullable), `publishing_cadence` (text, nullable), `primary_goal` (text, nullable), `ai_preference` (text, nullable), `review_cadence` (text, nullable), `onboarding_complete` (boolean, not null, default false).

**Relationships:** No new tables, no new foreign keys — pure column addition to the existing `profiles` table.

**Future consideration, not built here:** `system_architecture.md`'s Domain Model lists "Goal" as its own secondary entity, separate from Profile. For MVP, a single `primary_goal` text field is sufficient; a dedicated `goals` table (supporting multiple, trackable goals) is deferred until the Decision Engine (MAP-005) actually needs that granularity.

---

# API Requirements

**Endpoints:**
```
GET  /api/profile        — returns the current creator's full profile
PATCH /api/profile       — updates the current creator's profile fields
```

**Authentication:** Both require an authenticated session; both are scoped to the requester's own row via RLS.

---

# Edge Cases

- A creator updates only some fields, leaving others untouched → partial updates should not null out unspecified fields (standard PATCH semantics, not a full overwrite).
- A creator who is `migrated_from_manual` — their profile fields are all null until/unless they go through onboarding themselves. No special handling needed; they're treated like any other creator for this feature.

---

# Risks

**Low risk overall** — this is schema-only work with no UI and no external dependencies. The main risk is scope creep (being tempted to also build the onboarding form here) — explicitly guarded against by keeping this PRD narrow.

---

# Alternatives Considered

- **Separate `creator_profiles` table, joined to `profiles`** — rejected; adds a join to every request that needs profile data, for no real benefit at this scale.
- **Build Onboarding and Creator Profile as one combined PRD** — considered directly, Founder chose to keep them separate, matching the original `mvp_backlog.md` sequencing.

---

# Dependencies

**Internal dependencies:** MAP-001 (Authentication, `profiles` table) — complete.

**Blocks:** MAP-004 (Onboarding) needs this schema to exist before it can be built.

---

# Out of Scope

- The onboarding UI/flow itself (MAP-004).
- A normalized, multi-goal `goals` table (deferred to MAP-005 if needed).
- Any Decision Engine logic that reads this data (MAP-005).

---

# Rollout Strategy

**Internal testing:** Founder (or Claude Code, via a test script) verifies a profile can be updated and read back correctly, and that RLS correctly blocks cross-creator access — same manual verification rigor as every prior migration.

**Rollback plan:** Purely additive migration; if something's wrong, the new columns can simply be dropped without affecting existing auth/subscription data.

---

# Founder Decision

**Decision:** Approved

**Reasoning:** Schema is narrowly scoped (additive columns only, no destructive changes), fields are pulled directly from system_architecture.md's existing Creator Onboarding spec rather than invented, and it correctly stays separate from the onboarding UI (MAP-004) and Decision Engine logic (MAP-005) per the sequencing decision already made.

**Date:** 2026-09-12

**Owner:** Founder
