# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-005 — Decision Engine MVP

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Closed — Superseded by MAP-005 v2 (PRD-0007)

---

# Executive Summary

This is the feature MAP's entire product promise depends on: *"when a creator signs in, they should immediately know exactly what to do next."* Everything built so far — auth, payments, profile, onboarding — exists to feed this one engine. MAP-005 builds a deterministic (rules-based, not AI) recommendation generator, per AD-007, that reads a creator's profile and produces exactly one next action, plus a real "Today" screen (reusing the existing `/today` placeholder route) where they see it.

**Amended 2026-09-13 — role clarified following MAP-006's real scope (PRD-0007):** MAP-005's rule engine is not the long-term source of a creator's daily recommendation. Once MAP-006's AI-generated 30-day calendar exists and is Founder-approved for a creator, `/today` shows the matching calendar day instead. MAP-005 becomes the fallback — shown only while a creator's calendar hasn't been generated yet, or is still pending Founder review. This was always a reasonable role for a fast, deterministic engine; it just wasn't clear until MAP-006's real mechanism was understood. No functional change to MAP-005 itself was required.

This PRD also names, honestly, what it can't do yet: several of the recommendation rules described in `system_architecture.md` (resume an unfinished task, prioritize newsletter day, adjust for low energy) depend on data that doesn't exist until MAP-006 (30-Day Plan) and MAP-008 (Completion Tracking) are built. MAP-005 is scoped to what's genuinely possible today — one good, honest recommendation from profile data — architected so the fuller rule set can be added later without a rewrite.

---

# Problem Statement

- **What problem exists?** A creator can now sign up, pay (or use the free tier), and complete onboarding — but MAP still can't tell them what to actually do. The `/today` route is a static placeholder.
- **Who experiences it?** Every onboarded creator.
- **Why is it important?** This is MAP's actual value proposition. Nothing built so far delivers it yet.
- **How is this solved today?** It isn't — `/today` shows two placeholder cards with no real content.

---

# Customer

**Primary User:** An onboarded creator, opening MAP to find out what to do today.

**Jobs To Be Done:**

> "I want to open MAP and immediately know the one thing worth doing today, without having to think about it myself."

---

# Desired Outcome

A creator visits `/today` and sees one clear, specific recommendation — not a list, not options — with a title, a short description, an estimated time, and a reason it matters. For a brand-new creator with no history yet, the recommendation is still genuinely useful, not a placeholder or an error state.

---

# Success Metrics

**Primary Metric:** % of onboarded creators who see a real (non-placeholder) recommendation on `/today`.

**Secondary Metrics:** Recommendation relevance (does it actually reflect the creator's platform/goal — spot-checked manually at this stage, no automated scoring yet); time from page load to recommendation shown.

---

# User Story

As an onboarded creator,
I want to see one clear next action when I open MAP,
so that I don't have to figure out what to work on myself.

---

# User Journey

**New, Fully-Onboarded Creator — Happy Path**

Creator completes onboarding (MAP-004) → visits `/today`
↓ Decision Engine reads their profile (creator_type, platform, primary_goal, posting_frequency, etc.)
↓ No execution history exists yet (expected, since MAP-006/008 aren't built) → engine applies a "first action" rule
↓ Recommendation generated: title, description, estimated duration, reason, success criteria
↓ Creator sees it rendered on `/today`, replacing the placeholder cards

**Creator Who Hasn't Finished Onboarding**

Creator visits `/today` before completing onboarding
↓ Decision Engine's first rule fires: recommend finishing onboarding instead of a content task
↓ Recommendation points them back to the Tally form / onboarding checklist

**Failure Paths**

- Profile has genuinely insufficient data (e.g., migrated creator with only `focus_area` set, nothing else) → engine falls back to a generic-but-still-useful starter recommendation, not an error.
- Decision Engine throws an unexpected error → `/today` shows a clear fallback message, never a broken page.

---

# Functional Requirements

**FR1**
The system shall generate exactly one recommendation per request — never a list, never multiple options.

**FR2**
The system shall use deterministic, explicit rules — no AI/ML involved in this version, per AD-007.

**FR3**
Each recommendation shall include: a title, a short description, an estimated duration, a reason (why this matters now), and success criteria.

**FR4**
If a creator's `onboarding_complete` is false, the system shall recommend completing onboarding rather than any content-related action.

**FR5 (clarified 2026-09-13)**
If a creator has completed onboarding but has no execution history (expected for all creators at MVP launch), the system shall recommend "today's post" — a specific writing/shipping task derived from `platform`, `focus_area` (topic), and `tone`, framed as the concrete thing to write and publish today. MAP's current focus is helping writers consistently ship posts — the recommendation should reflect that directly, not a generic "get started" message.

**Worked example, using a real test profile** (platform: X/Twitter, focus_area: "AI and systems", tone: "Professional, tech founder in his mid-20s", primary_goal: "100 followers", posting_frequency: Daily, 3x):

> **Title:** Write today's X post
> **Description:** Draft a post about AI and systems for X, in your professional founder tone.
> **Estimated duration:** 15–20 minutes
> **Reason:** Daily posting keeps you moving toward your goal of 100 followers.
> **Success criteria:** One post drafted and ready to publish.

This confirms the rule is buildable from existing profile fields alone — no new data needed.

**FR6**
The system shall expose the recommendation via an API endpoint (`GET /api/recommendation`), consumed by the `/today` page.

**FR7**
The `/today` page shall render the real recommendation, replacing the current placeholder content.

**FR8**
The rule-evaluation logic shall be structured so additional rules (task-resume, newsletter-day, energy-based, Recovery Mode) can be added later without restructuring the engine — per `system_architecture.md`'s described pipeline, even though those specific rules aren't buildable yet.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Performance:** Recommendation generation should be fast (sub-second) — it's pure logic over already-fetched profile data, no external API calls.

**Explainability:** Per AD-007, every recommendation must be traceable to the specific rule that produced it — useful for debugging and for the "reason" field itself.

**Testability:** Rules must be unit-testable in isolation, same rigor as the payment/onboarding domain services already built this session.

**Maintainability:** New rules should be addable without modifying existing ones — an ordered rule list or similar pattern, not a monolithic if/else block.

---

# Acceptance Criteria

- Given an onboarded creator with no execution history, When they visit `/today`, Then they see one real, specific recommendation (not a placeholder, not an error).
- Given a creator who hasn't completed onboarding, When they visit `/today`, Then the recommendation directs them to finish onboarding.
- Given any recommendation, When displayed, Then it includes a title, description, estimated duration, reason, and success criteria.
- Given a creator with minimal profile data (e.g., only `focus_area` set), When a recommendation is generated, Then it's still a coherent, useful suggestion, not broken or blank.

---

# UX Requirements

**Screens involved:** `/today` (existing placeholder route, rebuilt with real content).

**Layout:** Per `system_architecture.md` §26 — welcome message, today's action, estimated time, why this matters. **No "Complete" button in this version** — per Founder decision, it's deferred until MAP-008 (Completion Tracking) can give it real persistence, rather than shipping a button that does nothing when clicked.

---

# AI Requirements

Does this feature use AI? **No.** Explicitly deterministic, per AD-007. Adaptive AI recommendations are a future phase, introduced only once real execution history exists to learn from.

---

# Data Requirements

No new tables required — reads existing `profiles` data (from MAP-003/004). No new persistence for MAP-005 itself; the recommendation is generated fresh on each request, not stored (storage of generated plans is MAP-006's job).

---

# API Requirements

**Endpoint:**
```
GET /api/recommendation
```
Session-authenticated, reads the caller's own profile, returns a single recommendation object.

---

# Edge Cases

- A migrated creator with `migrated_from_manual = true` but no onboarding data at all → same fallback treatment as any sparse profile; not a special case.
- Two creators with identical profiles should get the same recommendation logic applied (deterministic, reproducible) — not randomized.

---

# Risks

**Product Risk:** A "first action" recommendation that feels generic could undermine trust in the whole product on day one — this is the most important single interaction MAP has. Mitigation: the rule(s) for this case deserve real thought, not a throwaway default.

**Scope Risk:** It's tempting to try to build the fuller rule set (task-resume, energy-based, Recovery Mode) now — explicitly resisted here, since the data those rules need doesn't exist yet. Building them now would mean guessing at MAP-006/008's eventual shape.

---

# Alternatives Considered

- **Wait until MAP-006/007/008 exist, then build the full rule set at once** — rejected; per the architecture docs, the required inputs already support a genuinely useful MVP recommendation now, and shipping this sooner starts proving out the core product loop.
- **Use AI/LLM-generated recommendations from the start** — rejected per AD-007's explicit sequencing; deterministic first, adaptive AI only once real execution history exists.

---

# Dependencies

**Internal dependencies:** MAP-003 (Creator Profile), MAP-004 (Creator Onboarding) — both complete.

**Blocks:** MAP-006 (30-Day Plan) and MAP-007 (further Daily Focus enhancements) both build on this engine existing.

---

# Out of Scope

- Task-resume, newsletter-day, energy-based, and review-day rules — deferred until MAP-006/008 provide the data they need.
- Recovery Mode — deferred, requires completion/miss history (MAP-008).
- Persisting or tracking whether a recommendation was completed — that's MAP-008.
- Any AI-generated content or adaptive personalization.

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| Should the "Complete" button on /today be built now (even if it doesn't persist anything meaningful yet), or omitted until MAP-008 exists? | Founder | Medium | **Resolved — omitted, deferred to MAP-008** |
| What should the specific "first action" recommendation actually say for a creator with minimal profile data — is there a real example you'd want to see? | Founder | High | **Resolved — MAP's current focus is helping writers ship posts consistently; the recommendation is always a concrete "today's post" task derived from platform/focus_area/tone. See worked example in FR5.** |

---

# Founder Decision

**Decision:** Superseded

**Superseded by:** PRD-0007 — MAP-005 v2: AI-Driven 30-Day Content Calendar (2026-09-13)

**Reasoning for supersession:** This document scoped a simple, deterministic rule-based recommendation engine ("today's post"). Direct investigation of the founder's real, already-operating content system (the content-nudge-calendar and notion-post-drafter skills, and the live Notion "Content Master" schema) revealed the actual product has always been AI-driven — a 6-pillar, value-ladder content strategy with strict anti-fabrication rules, generating a full 30-day calendar, not one recommendation at a time. This PRD/IP undershot the real product and is fully replaced, not extended.

**Decision:** Approved

**Reasoning:** Scope is honestly bounded to what's buildable from existing profile data (MAP-003/004) without guessing at MAP-006/008's future shape. FR5 is grounded in a real worked example using actual test data, not invented copy. Correctly defers the Complete button rather than shipping non-functional UI. Matches AD-007's deterministic-first principle and system_architecture.md's documented pipeline.

**Date:** 2026-09-13

**Owner:** Founder