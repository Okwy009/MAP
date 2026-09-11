# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Per `development_workflow.md`, Stage 5 — Implementation Package.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0001 — User Authentication

**Related PRD:** PRD-0001 (Approved, 2026-09-03)

**Related Backlog Item:** MAP-001 — User Authentication

**Author:** MAP OS (Engineer Mode) — drafted for Founder/Engineering review

**Date:** 2026-09-03

**Version:** 1.0

**Status:** Approved

**Target Release:** v0.1.0

---

# Scope Summary

Implements passwordless authentication (Magic Link + email verification) via Supabase Auth, session middleware for protected routes, sign-out, resend-link handling, and migration of existing manually-onboarded creator(s) into real accounts. This is the first feature built — no prior application code exists. It establishes the repository skeleton every later MVP feature will build on.

Out of scope (per PRD-0001): OAuth providers, team accounts, role-based permissions beyond "Creator," payment logic (MAP-002), full Creator Profile content (MAP-003).

---

# Architecture Review

**Technical feasibility:** Low risk. Supabase Auth is a mature, managed service (AD-003) — no custom auth logic required.

**System impact:** Establishes the foundational identity layer. Every subsequent feature (MAP-002 through MAP-008) depends on the `auth.users` → `creator_profiles` relationship created here.

**Dependencies:** Supabase project provisioned. Resend account provisioned for transactional email (Magic Link delivery).

**Scalability:** Supabase Auth scales natively; no additional design needed at MVP volume.

**Security implications:** HTTPS enforced, JWT validation on every request, no passwords stored, refresh tokens fully server-managed. Reviewed against `01_security.md` and `02_authentication.md` — no deviations.

**ADRs referenced:** AD-002 (Next.js), AD-003 (Supabase), AD-008 (repository as source of truth), AD-009 (documentation before code).

---

# Technical Tasks

1. **Repository skeleton** — scaffold the base Next.js App Router project per `02_repository_architecture.md` / `system_architecture.md` (this is the first feature, so this also establishes `app/`, `components/`, `services/`, `repositories/`, `lib/`, `hooks/`, `types/`, `tests/`).
2. **Supabase project setup** — configure Supabase project, enable Magic Link auth provider, configure email templates (delegated to Resend per AD-005 where applicable).
3. **Auth service layer** — implement `services/auth/` per the layered architecture (Route → Application Service → Domain Service → Repository → Supabase). No business logic in route handlers.
4. **API routes** — implement per `01_api_architecture.md`:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/auth/logout`
   - `GET /api/auth/session`
5. **Middleware** — Next.js middleware to validate/refresh sessions and redirect unauthenticated requests away from `/app/*`.
6. **Creator Profile stub creation** — on first verified login, create exactly one `creator_profiles` row (full schema owned by MAP-003; this creates the minimal linking record only).
7. **Migration path for manually-onboarded creator(s)** — a one-time, founder-run migration script/flow that creates real accounts for existing manually-onboarded creators and attaches any context the founder has already gathered to their new `creator_profiles` stub, per FR11 of PRD-0001.
8. **Resend-link flow** — UI + endpoint support for requesting a new Magic Link when the original is lost or expired.
9. **Rate limiting** — basic per-email rate limit on Magic Link requests (hardcoded threshold for MVP per PRD open question; e.g. 5/hour).
10. **UI screens** — sign-up (email entry), "check your email" state, sign-in, verifying state, error state (expired/invalid link).
11. **Event emission** — emit `creator.signed_up`, `creator.verified`, `creator.signed_in`, `creator.signed_out` for future analytics/consumers.
12. **Logging** — log login/logout/failed login/expired/revoked events; explicitly never log tokens, secrets, or auth headers, per `02_authentication.md`.

---

# File Changes

```
app/
  (public)/
    sign-up/page.tsx
    sign-in/page.tsx
    auth/callback/page.tsx        # Magic Link landing/verification
  api/
    auth/
      register/route.ts
      login/route.ts
      logout/route.ts
      session/route.ts
  middleware.ts

services/
  auth/
    auth-service.ts                # Application Service — coordinates workflows
    auth-domain-service.ts         # Domain Service — business rules
    README.md

repositories/
  creator-profile.repository.ts

lib/
  supabase.ts
  resend.ts
  logger.ts

types/
  auth.ts
  creator.ts

hooks/
  useSession.ts

components/
  forms/
    SignUpForm.tsx
    SignInForm.tsx
  shared/
    LoadingSpinner.tsx
    ErrorState.tsx

scripts/
  migrate-manual-creators.ts       # one-time founder-run migration (task 7)

tests/
  unit/services/auth/
  integration/api/auth/
  e2e/auth-flow.spec.ts
```

---

# Database Migrations

- No custom `users` table — Supabase manages `auth.users` natively.
- New table: `creator_profiles`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → `auth.users.id`, unique — enforces one-to-one)
  - `created_at`, `updated_at`
  - `migrated_from_manual` (boolean, default false) — flags creators migrated per task 7, for traceability
  - Remaining columns (name, creator type, platform, goals, etc.) deferred to MAP-003; this migration creates only the stub/linking columns.
- Row-Level Security (RLS) policy: creators may read/update only their own `creator_profiles` row.

---

# API Endpoints

(As listed in Technical Tasks #4 — no additions beyond `01_api_architecture.md`'s Authentication Routes.)

| Endpoint | Auth Required | Notes |
|---|---|---|
| `POST /api/auth/register` | No | Rate-limited per email |
| `POST /api/auth/login` | No | Rate-limited per email |
| `POST /api/auth/logout` | Session cookie | Clears session + cookies |
| `GET /api/auth/session` | Session cookie | Returns session state (Loading/Authenticated/Unauthenticated/Expired/Error) |

---

# Component Updates

New components only (no existing components to update — first feature built). See File Changes above. All components follow `frontend-design` conventions and contain no business logic, per repository rules (`components/` = presentation only).

---

# Testing Requirements

**Unit tests:** Auth domain service logic (session validation rules, rate-limit logic), independent of HTTP/React.

**Integration tests:** Full request/response cycle for each API route, including failure paths (invalid email, expired token, duplicate signup).

**End-to-end tests:** Full sign-up → verify → session → sign-out flow; expired-session redirect flow; resend-link flow.

**Manual QA:** Test Magic Link delivery and click-through on at least two real email clients (per PRD's UX risk about mobile email clients).

**Accessibility verification:** Keyboard navigation, screen-reader labels, visible focus states on all auth screens (per PRD UX Requirements).

**Regression scope:** N/A — first feature, no prior functionality to regress.

**Coverage expectation:** Per `05_testing_strategy.md`, this is foundational/critical-path logic — aim for near-complete coverage on the auth domain service, consistent with the standard applied to Decision Engine and Recovery Mode.

---

# Rollout Plan

Mirrors PRD-0001's Rollout Strategy, made concrete:

1. **Internal testing** — founder runs the full flow manually (sign-up, verify, sign-in, expiry, sign-out) in a non-production Supabase environment.
2. **Migration** — run `scripts/migrate-manual-creators.ts` once, for the manually-onboarded creator(s) currently in progress. Verify their existing context (whatever the founder has gathered by hand) attaches correctly to the new account.
3. **Alpha** — those migrated creators use their new real accounts for their next MAP interaction.
4. **Beta** — open sign-up to new creators converting from the waitlist.
5. **Public release** — bundled with MAP-002 (Payment), since access without payment isn't a complete flow yet.

**Rollback plan:** If Magic Link delivery proves unreliable in any stage, revert to the current manual-access process while the issue is fixed — per PRD-0001, no creator should be locked out entirely during rollout.

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-001)
- [x] PRD approved (PRD-0001)
- [x] Architecture reviewed (above)
- [x] Implementation Package approved
- [x] Dependencies resolved (none — first feature)
- [x] Acceptance criteria complete (inherited from PRD-0001)

---

# Founder / Engineering Decision

**Decision:** Approved

**Reasoning:** Plan follows approved architecture (Supabase, Next.js, layered services), scope matches PRD-0001 exactly with no additions, and the manual-creator migration path is concrete and sequenced first in rollout.

**Date:** 2026-09-03

**Owner:** Founder
