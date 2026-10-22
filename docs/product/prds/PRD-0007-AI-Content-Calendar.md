# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-006 — AI Content Calendar Generation

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Deferred — see decision log, 2026-09-13

---

# Executive Summary

This is MAP's actual core deliverable — automating the process the Founder currently runs manually for every real client (paste intake data into a Claude Project, run a 6-step research-and-critique pipeline, produce a 30-day content calendar). This PRD replaces the originally-planned simple version of MAP-006 with the real mechanism, verified against the Founder's actual working prompt and the real schema of clients' existing Notion "Content Master" databases.

MAP-005 (Decision Engine, already shipped) is repurposed as a fallback: once a calendar exists, "today's task" is a lookup from it. The rule engine only fires for creators whose calendar hasn't generated yet.

**Amended 2026-09-13 — Founder review gate added:** for this initial version, a generated calendar does not reach a creator automatically. It lands in a `pending_review` state; the Founder reviews and approves it before the creator ever sees it. This is a deliberate quality gate while the automated pipeline is new and unproven against real clients.

---

# Problem Statement

- **What problem exists?** Every real client currently gets their calendar built by the Founder manually, one at a time, by hand-running a Claude conversation. This doesn't scale past a handful of clients and depends entirely on Founder availability.
- **Who experiences it?** The Founder (bottleneck), and every creator waiting on a calendar to be built for them.
- **Why is it important?** This is literally the product — the thing MAP promises to deliver.
- **How is this solved today?** Manually, by the Founder, via a documented Claude Project prompt (verified and reused as the basis for this PRD).

---

# Customer

**Primary User:** A creator who has completed onboarding, waiting for their personalized content calendar.

**Secondary User:** The Founder, whose manual bottleneck this removes.

---

# Desired Outcome

Once a creator completes onboarding (Tally submission processed, `onboarding_complete = true`), MAP automatically generates a real, researched, critiqued, personalized 30-day content calendar — matching the quality and structure of what the Founder currently produces by hand — with no manual intervention required.

---

# Success Metrics

**Primary Metric:** % of onboarded creators who receive a generated calendar without Founder involvement.

**Secondary Metrics:** Generation time (target: under the "Calendar Generation < 10 seconds" budget in `system_architecture.md`'s performance targets — likely needs revisiting given this is now a multi-step AI+research pipeline, not a simple lookup); cost per calendar generated; Founder's own qualitative assessment of output quality vs. their manual process.

---

# User Story

As an onboarded creator,
I want a real, researched, personalized content calendar built for me automatically,
so that I don't have to wait for the Founder to build it by hand.

As the Founder,
I want this pipeline to match the quality of my manual process,
so that automating it doesn't mean giving clients a worse product.

---

# User Journey

**Happy Path**

Creator completes Tally onboarding → `onboarding_complete` flips true (existing MAP-004 webhook)
↓ Calendar generation pipeline triggers automatically
↓ **Step 1 (existing data):** Profile fields already captured — niche/focus_area, audience, subscriber_count, posting cadence, tone, primary_goal
↓ **Step 2:** Check niche-research cache — if fresh research exists for this niche, reuse it; if not, proceed to research
↓ **Step 3 (if needed):** Web search for the top 10 creators in this niche — what they write about, what's working, cadence patterns. Cached for reuse by future creators in the same/similar niche.
↓ **Step 4:** Generate content pillars tailored to this specific creator's audience/goal
↓ **Step 5:** Run the "cynical veteran" critique pass against the draft pillars/calendar — identify weak, unrealistic, or too-safe elements with concrete numeric thresholds
↓ **Step 6:** Rebuild incorporating the critique
↓ **Step 7:** Generate the full 30-row calendar (Content Title, Due Date, Platform, Type, Tags, Goal/CTA, Value Ladder Stage, Story/Hook, Prompt), with Due Date starting from the creator's own `start_date` (already captured in onboarding)
↓ Calendar stored in MAP's own database with status `pending_review`
↓ Founder reviews via the internal approval view, approves (or rejects, triggering regeneration)
↓ Once approved, creator's `/today` shows Day 1 of their real calendar instead of the MAP-005 fallback recommendation

**Fallback Path (calendar not yet ready)**

Creator visits `/today` before their calendar has finished generating (pipeline still running, or hasn't started)
↓ MAP-005's existing rule engine provides a temporary recommendation
↓ Once the calendar completes, subsequent visits show real calendar-driven content

**Failure Paths**

- Pipeline fails partway (AI error, web search failure) → logged, retryable, creator stays on MAP-005 fallback rather than seeing a broken/empty state.
- A generated calendar item is malformed or incomplete → validated before storage; reject and retry generation rather than storing broken data.

---

# Functional Requirements

**FR1**
The system shall automatically trigger calendar generation when a creator's `onboarding_complete` flips to `true`.

**FR2**
The system shall check for existing, non-stale niche research before running new web research, reusing cached results across creators in the same niche.

**FR3**
The system shall run web search to identify real creators/publications in the creator's niche when cached research doesn't exist or is stale.

**FR4**
The system shall generate content pillars personalized to the specific creator's audience, tone, and goal — not just generic niche advice.

**FR5**
The system shall run a self-critique pass against the draft calendar/pillars before finalizing, per the Founder's existing process (the "cynical veteran" critique step), producing concrete, numeric feedback rather than vague notes.

**FR6**
The system shall rebuild the calendar incorporating the critique before final output.

**FR7**
The system shall generate exactly 30 calendar items, each containing: Content Title, Due Date, Platform, Type, Tags, Goal/CTA, Value Ladder Stage, Story/Hook, and Prompt — matching the real schema already in use in clients' Notion databases.

**FR8**
Due dates shall start from the creator's own `start_date` (captured during onboarding), spaced according to their stated posting frequency.

**FR9**
The generated calendar shall be stored in MAP's own database — not synced to Notion in this version (deferred, per Founder decision).

**FR10**
Until a creator's calendar exists, `/today` shall fall back to MAP-005's existing rule-based recommendation.

**FR11**
Once a calendar's status is `approved`, `/today` shall show the calendar item matching the current date, replacing the MAP-005 fallback. A `pending_review` calendar shall not be shown to the creator — they continue seeing the MAP-005 fallback until approval.

**FR12 (added 2026-09-13 — Founder review gate)**
A newly generated calendar shall be stored with status `pending_review`, not visible to the creator, until the Founder explicitly approves it.

**FR13**
The system shall provide the Founder a simple internal view listing calendars awaiting review, with the ability to approve (making it visible to the creator) or reject (discarding it, allowing regeneration). Per-item editing of individual calendar rows is out of scope for this version — approval is whole-calendar, not row-by-row.

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Cost control:** Niche-research caching (FR2) exists specifically to bound API/search costs — this is a real, ongoing operating expense, not a one-time build cost, and should be monitored.

**Reliability:** A multi-step AI pipeline has more failure points than anything built so far this session — each step should be independently retryable, and a failure at any step should not leave a creator in a broken state (FR10's fallback exists for exactly this).

**Performance:** This is a background/async process, not a page-load-blocking one — the creator shouldn't be staring at a spinner for a multi-step AI pipeline. Per AD (Principle 5 in `system_architecture.md`): "AI Should Never Block the UI."

**Explainability/Auditability:** Given real money is spent per generation, log each pipeline run's steps, duration, and outcome — same rigor as other background jobs already logged this session (Gumroad Ping processing, Tally webhook processing).

---

# Acceptance Criteria

- Given a creator completes onboarding, When the pipeline runs successfully, Then 30 calendar items exist in the database, correctly dated from their `start_date`.
- Given two creators in the same niche, When the second one's calendar is generated, Then niche research is reused rather than re-fetched from the web.
- Given a creator visits `/today` before their calendar exists, When the page loads, Then they see the MAP-005 fallback recommendation, not an error or empty state.
- Given a creator visits `/today` after their calendar exists but is still pending_review, When the page loads, Then they still see the MAP-005 fallback, not the unapproved calendar.
- Given a calendar has been approved by the Founder, When the creator visits `/today`, Then they see the calendar item matching today's date.
- Given the pipeline fails at any step, When the failure occurs, Then it's logged with enough detail to diagnose, and the creator is not left without any recommendation.

---

# AI Requirements

Does this feature use AI? **Yes — extensively, and this is the first feature this session to do so.**

**AI Responsibilities exercised:** Content pillar generation, web-research synthesis, self-critique, calendar drafting — all explicitly listed as AI Responsibilities in `system_architecture.md` ("Expand ideas," "Suggest outlines," "Draft content," "Generate summaries").

**Relationship to AD-007:** AD-007 states the *Decision Engine* should be deterministic first, AI only after execution history exists. This PRD doesn't violate that — MAP-005 (the Decision Engine) remains deterministic and unchanged. This is a **separate system** (calendar generation) that was always intended to use AI, per the Founder's actual real-world process, which has used AI from day one. Worth a documentation note reconciling this distinction explicitly (see Documentation Updates below).

**Prompts should be versioned,** per `system_architecture.md` §21 — the Founder's actual working prompt (provided this session) becomes the versioned v1 baseline.

---

# Data Requirements

**New table: `niche_research`**
- `id`, `niche_key` (normalized niche/focus_area string), `research_content` (the synthesized findings), `generated_at`, `stale_after` (TTL for cache invalidation).

**New table: `content_calendar_items`**
- `id`, `creator_id`, `content_title`, `due_date`, `platform`, `type`, `tags`, `goal_cta`, `value_ladder_stage`, `story_hook`, `prompt`, `status` (Idea/In progress/Published — matching the real Notion schema, applies per-row once visible), `created_at`.

**New field on the calendar as a whole (not per-row):** `review_status` (`pending_review` / `approved` / `rejected`) — gates visibility per FR12/FR13. Likely its own small table or a column grouping the 30 rows by generation batch, since approval is whole-calendar.

**Existing data reused:** `profiles.focus_area`, `.audience`, `.subscriber_count`, `.posting_frequency_type/count`, `.tone`, `.primary_goal`, `.start_date`.

---

# API Requirements

**Trigger:** Internal — fires from the existing Tally webhook flow (MAP-004) when `onboarding_complete` becomes true, not a new external-facing endpoint.

**New endpoint:**
```
GET /api/calendar/today  — returns today's calendar item if one exists, else null (caller falls back to /api/recommendation)
```

---

# Edge Cases

- A creator's niche doesn't match any cached research closely enough → treated as a cache miss, fresh research runs (exact-match caching for MVP; fuzzy niche-matching is an open question, not solved here).
- A creator's 30 days run out → what happens next (regenerate, extend, notify Founder) is explicitly out of scope for this PRD — flagged as an open question.
- Pipeline runs but produces fewer than 30 valid items → rejected, retried, not partially stored.

---

# Risks

**Cost Risk:** Real, ongoing AI + web search costs per creator, partially mitigated by research caching — worth monitoring actual spend once live, not just assuming the cache is enough.

**Quality Risk:** An automated version could produce weaker output than the Founder's hand-run process, especially since the "critique" step's value depends on the AI genuinely finding real weaknesses, not just performing the persona. Mitigation: Founder should spot-check early automated calendars against what they'd have produced manually.

**Reliability Risk:** Most complex, most-failure-point pipeline built this session. Mitigation: FR10's fallback ensures a broken pipeline never leaves a creator with nothing.

---

# Alternatives Considered

- **Keep this manual indefinitely** — rejected; doesn't scale, was the explicit problem being solved.
- **Skip the critique step to simplify/cut cost** — rejected; it's a deliberate, real part of the Founder's proven process, not incidental.
- **Sync directly to Notion instead of MAP's own database** — rejected for this version, per Founder decision; deferred to a later PRD.

---

# Dependencies

**Internal:** MAP-003/004 (Creator Profile, Onboarding) — complete, provides all input data. MAP-005 (Decision Engine) — complete, becomes the fallback.

**External (new):** An AI API (Anthropic, presumably, given this session's context) — not yet integrated anywhere in MAP. Web search capability, server-side.

**Blocks:** MAP-007 (Daily Focus Screen enhancements) and MAP-008 (Completion Tracking) both become more meaningful once real calendar-driven tasks exist to track.

---

# Out of Scope

- Notion sync (deferred).
- What happens after a creator's 30 days are used up (open question, future PRD).
- Fuzzy/semantic niche matching for the research cache (exact-match only for MVP).
- Any UI for the Founder to manually review/edit a calendar before a creator sees it (worth considering later, not built here).

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| What happens when a creator's 30 days are used up — auto-regenerate, manual trigger, notify Founder? | Founder | Medium | Open |
| How exactly should niche matching work for the research cache — exact focus_area string match, or something smarter? | Engineering | Medium | Open (defaulting to exact-match for MVP) |
| Should the Founder have any review/approval step before a generated calendar reaches a real creator, at least initially? | Founder | High | **Resolved — yes, mandatory for this version. See FR12/FR13.** |

---

# Founder Decision

**Decision:** Deferred (previously Approved same day — reversed after real cost estimate)

**Reasoning:** The design itself remains sound (see original reasoning below), but after seeing real, current cost figures — Anthropic API usage plus a likely-required Vercel Pro upgrade (~$25–$40/month to start) and genuinely new infrastructure (first AI integration, first background job, first internal-only UI) — the Founder chose to continue the proven manual process rather than automate now. This is a legitimate build-vs-buy-time tradeoff, not a rejection of the approach. Revisit once manual volume or economics justify the investment.

**Original reasoning (2026-09-13, before deferral):** Built directly from the Founder's real, proven manual process rather than an invented simplification. Correctly reuses existing profile/onboarding data, repurposes MAP-005 as a fallback rather than discarding it, and includes a mandatory Founder review gate (FR12/FR13) for this initial version given the pipeline is new and unproven at scale. Cost is bounded via niche-research caching.

**Date:** 2026-09-13

**Owner:** Founder