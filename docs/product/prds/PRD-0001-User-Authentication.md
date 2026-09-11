# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> The purpose of this document is to ensure the problem is understood before a solution is built.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-001 — User Authentication

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-03

**Version:** 1.0

**Status:** Approved

---

# Executive Summary

MAP needs a way to know who a creator is, keep that identity secure, and let them return to their account without friction. This feature implements passwordless authentication (Magic Link + email verification) via Supabase, establishing the identity layer every other MVP feature (payment, profile, onboarding, decision engine) depends on. Without it, nothing else in the MVP build order can start — it is Order #1 for a reason.

---

# Problem Statement

Creators currently have no way to create a persistent, secure identity with MAP. Right now, "onboarding" is you personally guiding a user by hand — there is no account, no session, and no way for a creator to leave and come back to a continuous experience.

- **What problem exists?** There is no mechanism for a creator to establish or return to a private, secure MAP identity.
- **Who experiences it?** Every creator who wants to use MAP beyond a single manual session with the founder.
- **Why is it important?** Every downstream MVP feature (Payment, Profile, Onboarding, Decision Engine, Daily Focus, Completion Tracking) requires a known, authenticated creator. This is the foundation the entire MVP is built on.
- **How do users solve this today?** They don't — access is entirely manual and founder-mediated.

---

# Customer

**Primary User:** The individual creator signing up to use MAP for the first time.

**Secondary User:** A returning creator resuming daily use.

**Jobs To Be Done:**

> "I want to create an account and get back into MAP without friction, so I can stop overthinking the login process and get straight to today's action."

---

# Desired Outcome

A creator can establish their MAP identity in under a minute, without creating or remembering a password, and can return on any device with a persistent, secure session. Authentication should feel invisible — never a source of friction or doubt.

---

# Success Metrics

**Primary Metric:** % of started sign-ups that reach a verified, active session (signup-to-verified conversion).

**Secondary Metrics:**
- Median time from "enter email" to "verified session active"
- Magic Link email delivery success rate
- Session-related support requests (target: near zero)
- Returning-session success rate (creator opens MAP, session restores without re-authentication)

---

# User Story

As a creator,
I want to sign up and sign in without a password,
so that I can access MAP quickly and securely without friction or forgotten-password anxiety.

---

# User Journey

**New Creator — Happy Path**

Starting State: Creator has purchased or been granted access, has no MAP account.
↓ Enters email on sign-up screen
↓ MAP (via Supabase) creates a pending account and sends a verification / Magic Link email
↓ Creator opens email, clicks link
↓ Supabase validates the token, creates a session
↓ Creator Profile record is created (empty, ready for onboarding — MAP-003/004)
↓ Redirect to Onboarding

**Returning Creator — Happy Path**

Starting State: Creator has a verified account, session may be active or expired.
↓ Opens MAP
↓ If session valid → redirected straight to Today's Action (no login screen)
↓ If session expired → enters email, receives new Magic Link, signs in
↓ Session restored, redirected to Today's Action

**Failure Paths**

- Email not received → creator can request resend.
- Link expired or already used → clear error, option to request a new link.
- Network failure during verification → error state, safe retry, no partial account created.
- Creator abandons before verifying → account remains "unverified," cannot access paid or onboarding flows.

---

# Functional Requirements

**FR1**
The system shall allow a creator to request account creation using only an email address (no password).

**FR2**
The system shall send a Magic Link / verification email via Supabase Auth upon signup or sign-in request.

**FR3**
The system shall create a session only after the creator successfully verifies ownership of their email by clicking the Magic Link.

**FR4**
The system shall persist sessions for 30 days by default, refreshing automatically while the creator remains active, per `02_authentication.md`.

**FR5**
The system shall allow a creator to sign out, which destroys the session and clears session cookies.

**FR6**
The system shall protect all routes under `/app/*` via Next.js middleware, redirecting unauthenticated requests to sign-in.

**FR7**
The system shall allow a creator to resend a Magic Link if the original is lost, expired, or unused.

**FR8**
The system shall create exactly one Creator Profile record upon first successful verification, and never duplicate it on subsequent logins.

**FR9**
The system shall support multi-device sessions — a creator may be signed in on more than one device simultaneously.

**FR10**
The system shall reject any account access attempt prior to email verification, including attempts to reach onboarding or payment flows.

**FR11**
The system shall support migrating existing manually-onboarded creators into real accounts, preserving any context the founder has already gathered (e.g. profile/goal information collected by hand) rather than requiring them to re-onboard from zero.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Performance:** Magic Link email should be sent within 5 seconds of request; session validation should add no more than ~100ms to any protected request.

**Security:** HTTPS only. JWT validation on every request. Refresh tokens server-managed by Supabase — no custom refresh logic. Session fixation prevented. No tokens or secrets ever logged.

**Accessibility:** Sign-in/sign-up forms fully keyboard-navigable, screen-reader labeled, visible focus states.

**Reliability:** Auth failures must degrade gracefully — a failed email send should surface a clear retry path, never a silent failure or a half-created account.

**Scalability:** Must support growth from first manual user to hundreds of concurrent creators without architecture changes (Supabase Auth scales natively).

**Maintainability:** No custom authentication logic — Supabase Auth remains the sole provider, per AD-003.

**Privacy:** Email is the only PII collected at this stage. No password to store or leak.

---

# Acceptance Criteria

- Given a new creator enters a valid email, When they submit the sign-up form, Then a Magic Link email is sent and no session is created until the link is verified.
- Given a creator clicks a valid, unexpired Magic Link, When Supabase validates the token, Then a session is created and a Creator Profile record is created exactly once.
- Given a creator has an active session, When they open MAP, Then they are redirected directly to their current state (no login screen shown).
- Given a creator's session has expired, When they open MAP, Then they are redirected to sign-in with a clear, non-alarming message.
- Given a creator clicks an expired or already-used Magic Link, When the token is validated, Then they see a clear error with an option to request a new link.
- Given a creator selects "sign out," When the action completes, Then their session and cookies are fully cleared and they are redirected to the public home page.
- Given an unverified account attempts to access `/app/*`, When the request is made, Then it is rejected and redirected to the verification step.

---

# UX Requirements

**Screens involved:** Sign-up (email entry), "check your email" confirmation state, sign-in (email entry), Magic Link landing/verifying state, error state (expired/invalid link), sign-out confirmation (implicit, not a separate screen).

**States:** Loading (sending link / verifying token), Empty (first-time, no account), Error (invalid/expired link, failed send), Offline (network unavailable — show retry, never silently fail).

**Accessibility considerations:** Clear, single-purpose screens; no dense forms; large tap targets; error messages in plain language, never technical.

---

# AI Requirements

Does this feature use AI? **No.**

Authentication is intentionally deterministic and provider-managed (Supabase). No AI involvement.

---

# Data Requirements

**New database tables:** None beyond what Supabase Auth manages natively (`auth.users`). A `creator_profiles` table is created here as a stub record (populated fully by MAP-003).

**Existing tables:** None yet — this is the first feature built.

**Relationships:** `creator_profiles.user_id` → `auth.users.id` (one-to-one).

**Events emitted:** `creator.signed_up`, `creator.verified`, `creator.signed_in`, `creator.signed_out`.

**Analytics tracked:** Signup started, signup completed (verified), sign-in success/failure, session expired.

**Data retention:** Standard Supabase Auth retention; no custom retention logic at this stage.

**Privacy implications:** Minimal — email only. No sensitive data collected in this feature.

---

# API Requirements

**Endpoints** (per `01_api_architecture.md`):
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

**Inputs:** Email address (register/login). No inputs required for logout/session (session token via cookie).

**Outputs:** Session status, redirect instructions, error codes.

**Authentication:** N/A for register/login (public); session-cookie required for logout/session.

**Rate limits:** Magic Link requests should be rate-limited per email to prevent abuse (e.g., max 5 requests per hour).

**Versioning:** Not versioned at MVP stage; single active API surface.

---

# Edge Cases

- Creator enters an email that already has a pending, unverified account → resend link rather than creating a duplicate.
- Creator requests multiple Magic Links in quick succession → only the most recent link should be valid; previous links invalidated.
- Creator verifies on a different device than they signed up on → session should still be created correctly.
- Creator's email bounces or is invalid → clear error, no false "check your email" confirmation.
- Creator deletes their verification email before clicking → resend flow must be discoverable and simple.
- A manually-onboarded creator signs up with the same email the founder already has context on → the system must link the new account to that existing context rather than treating them as a brand-new creator with no history.

---

# Risks

**Technical Risks:** Reliance on Supabase and Resend availability — an outage in either blocks all account access. Mitigation: clear user-facing error states, monitor provider status.

**Product Risks:** Passwordless flows can confuse users unfamiliar with Magic Links. Mitigation: simple, reassuring copy ("check your email — no password needed").

**Business Risks:** Slow or undelivered emails directly block revenue (payment flow, MAP-002, depends on this). Mitigation: monitor delivery rate closely from day one.

**User Experience Risks:** Any friction here is the very first impression of MAP. Mitigation: keep the flow to two screens, test on mobile email clients specifically.

---

# Alternatives Considered

- **Password-based authentication** — rejected. Adds friction, forgotten-password support burden, and a larger attack surface, which directly conflicts with MAP's cognitive-load-reduction principle.
- **OAuth-only (Google/GitHub) at MVP** — rejected for now. Adds provider complexity before it's needed; deferred to a future phase per `02_authentication.md`. Magic Link is simpler and sufficient for MVP.

---

# Dependencies

**Internal dependencies:** None — this is the first feature in the build order.

**External services:** Supabase (Auth, Postgres), Resend (email delivery for Magic Link).

**APIs:** Supabase Auth API.

**Infrastructure:** Next.js middleware for route protection.

**Feature flags:** None required at MVP.

---

# Out of Scope

- OAuth providers (Google, GitHub, Apple, Microsoft) — future phase.
- Team accounts / multi-user workspaces — future phase.
- Role-based permissions beyond the single "Creator" role — future phase.
- Payment/licensing logic — owned by MAP-002.
- Creator Profile content beyond the stub record — owned by MAP-003.

---

# Rollout Strategy

**Internal testing:** Founder verifies full sign-up/sign-in/sign-out/expiry flow manually before any external use.

**Alpha:** Migrate the manually-onboarded creator(s) already in progress into real accounts first. This is the founder's own decision (confirmed) — their existing context should carry over, not be discarded. This migration is the first real test of the auth flow before opening it to new signups.

**Beta:** Open to new signups from the waitlist as they convert.

**Public release:** Bundled with MAP-002 (Payment) once both are complete, since access without payment isn't yet a complete flow.

**Success criteria per phase:** Zero failed verifications in internal testing; <5% support requests related to login in alpha/beta.

**Rollback plan:** If Magic Link delivery proves unreliable, fall back to manual account provisioning by founder (already the current process) while the issue is fixed — no creator should be locked out entirely.

---

# Documentation Updates

- `system_architecture.md` — mark Authentication Service as implemented, not just specified.
- `decision_log.md` — record the decision to proceed with MAP-001 and any deviations from this PRD.
- `release_history.md` — log v0.1.0 groundwork once shipped.
- `known_issues.md` — log any deferred edge cases discovered during build.

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| Do the currently manually-onboarded creators need a migration path into real accounts, or do they simply sign up fresh? | Founder | High | **Resolved — migrate into real accounts, preserving existing context (see FR11)** |
| Should Magic Link rate-limiting thresholds be configurable, or hardcoded for MVP? | Engineering | Low | Open |

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

**Reasoning:** Authentication is the foundation every other MVP feature depends on, the approach follows MAP's approved architecture (Supabase Magic Link, no passwords), and the migration path for existing manually-onboarded creators is now specified in FR11.

**Date:** 2026-09-03

**Owner:** Founder

---

# Post-Launch Review

_To be completed after release._

---

# MAP Product Principles Validation

**Does this feature reduce cognitive load?**
Yes. Passwordless auth removes the single most common source of login friction and support burden.

**Does it help users take meaningful action?**
Indirectly — it's the gate that unlocks every meaningful action in MAP, but delivers no action itself.

**Does it protect momentum?**
Yes. Persistent 30-day sessions mean creators are never blocked from returning by a forgotten credential.

**Does it respect different levels of time and energy?**
Yes. A single email field is the lowest-effort entry point possible.

**Is it simpler than the alternative?**
Yes. No password reset flows, no credential storage, no forgotten-password support burden.

**Final Question — If this feature did not exist, would users be significantly less likely to make progress?**
Yes — without it, no creator can have a persistent account at all, and MAP remains permanently manual.

---

# MAP Philosophy Check

This feature should leave users feeling: *"I know exactly what to do next."*

Applied here: a creator should feel *"getting into MAP was effortless — I never had to think about it."* Authentication succeeds when it is invisible.
