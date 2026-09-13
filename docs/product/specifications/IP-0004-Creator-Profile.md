# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0004 — Creator Profile (Schema + Basic CRUD)

**Related PRD:** PRD-0004 / MAP-003 (Approved, 2026-09-12)

**Related Backlog Item:** MAP-003 — Creator Profile

**Author:** MAP OS (Engineer Mode)

**Date:** 2026-09-12

**Version:** 1.0

**Status:** Approved

**Target Release:** v0.1.0

---

# Scope Summary

Extends the existing `profiles` table with the nine context fields from PRD-0004, adds a `GET`/`PATCH /api/profile` endpoint pair, and RLS-verifies that a creator can only touch their own row. No UI — that's MAP-004.

---

# Architecture Review

**Technical feasibility:** Low risk — purely additive migration, no destructive changes, no new tables, no external service dependency.

**System impact:** Minimal. Extends a table every other feature already reads from; no new joins introduced.

**Dependencies:** None blocking — MAP-001's `profiles` table and RLS pattern are already established and directly reused.

---

# Technical Tasks

1. **Migration** — `supabase/migrations/000005_add_creator_profile_fields.sql`: add the nine nullable columns plus `onboarding_complete boolean not null default false` to `profiles`. Does not touch 000001-000004.
2. **Repository extension** — extend the existing profile-reading pattern (used elsewhere, e.g. `creator.repository.ts`) with `getProfile(userId)` and `updateProfile(userId, fields)`, respecting partial-update semantics (FR: don't null unspecified fields on PATCH).
3. **API routes** — `app/api/profile/route.ts`: `GET` returns the caller's profile (session-authenticated); `PATCH` updates only the fields provided in the request body.
4. **RLS verification** — confirm the existing `profiles` RLS policy (creators read/write only their own row) correctly covers the new columns (it should, since RLS is row-level not column-level, but worth an explicit test rather than assuming).
5. **Types** — add the new fields to whatever shared profile type already exists in `types/`.

---

# File Changes

```
supabase/
  migrations/
    000005_add_creator_profile_fields.sql

app/
  api/
    profile/
      route.ts

repositories/
  creator.repository.ts        # extended, not replaced

types/
  profile.ts                   # new or extended, depending on what exists
```

---

# Database Migration

```sql
-- 000005_add_creator_profile_fields.sql
alter table profiles
  add column creator_type text,
  add column platform text,
  add column audience text,
  add column topics text,
  add column tone text,
  add column publishing_cadence text,
  add column primary_goal text,
  add column ai_preference text,
  add column review_cadence text,
  add column onboarding_complete boolean not null default false;
```

No RLS changes needed — the existing `profiles` policy already scopes by row (creator_id / id = auth.uid()), which covers all columns automatically.

---

# API Endpoints

| Endpoint | Auth Required | Notes |
|---|---|---|
| `GET /api/profile` | Session cookie | Returns caller's full profile |
| `PATCH /api/profile` | Session cookie | Updates only provided fields; must not null out omitted ones |

---

# Testing Requirements

**Unit/integration:** Verify PATCH with a partial payload doesn't clear other fields. Verify RLS rejects a request attempting to read/write another creator's `id`.

**Manual QA:** Founder (or a throwaway test script, deleted after) confirms a real profile can be updated and read back correctly against the live database.

---

# Rollout Plan

**Internal testing:** Apply migration via SQL Editor (same process as every prior migration), then verify GET/PATCH work correctly for a real account.

**Rollback plan:** Purely additive — columns can be dropped with zero impact on auth or subscription data if something's wrong.

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-003)
- [x] PRD approved (PRD-0004)
- [x] Architecture reviewed
- [x] Implementation Package approved
- [x] Dependencies resolved (MAP-001 complete)
- [x] Acceptance criteria complete (inherited from PRD-0004)

---

# Founder / Engineering Decision

**Decision:** Approved

**Reasoning:** Purely additive migration (nullable columns, no destructive changes), no new tables, no external dependencies, correctly reuses MAP-001's existing profiles table and RLS pattern rather than introducing a parallel structure. Narrow, well-bounded scope matching PRD-0004 exactly.

**Date:** 2026-09-12

**Owner:** Founder
