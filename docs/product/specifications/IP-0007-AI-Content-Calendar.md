# Implementation Package

> Translates an approved PRD into an engineering execution plan.
> Engineering may not begin until this package is approved.

---

# IP Information

**Title:** IP-0007 — AI Content Calendar Generation

**Related PRD:** PRD-0007 / MAP-006 (Approved, 2026-09-13)

**Related Backlog Item:** MAP-006 — Personalized 30-Day Plan

**Author:** MAP OS (Engineer Mode)

**Date:** 2026-09-13

**Version:** 1.0

**Status:** Deferred — see PRD-0007's deferral, decision log 2026-09-13

**Target Release:** v0.2.0 (this is meaningfully larger than the v0.1.0 features; flagging the version bump as a recommendation, not silently deciding it)

---

# Scope Summary

Builds the 6-step AI pipeline (pillars → research → critique → rebuild → 30-item calendar), a niche-research cache, a Founder review/approval gate, and the fallback wiring so `/today` prefers an approved calendar over MAP-005's rule engine. This is the largest, most architecturally novel build this session — first real AI API integration, first background/async processing pattern, first internal-only (Founder-facing) UI.

---

# Architecture Review

**Technical feasibility:** Moderate-high risk, for reasons worth naming plainly rather than glossing over:

1. **This is MAP's first genuine background job.** Everything built so far (webhooks, API routes) completes within a normal request/response cycle. A 6-step AI pipeline with web research realistically takes anywhere from 30 seconds to a few minutes — far longer than a webhook response should take to return. This needs to run *after* the Tally webhook responds, not inside it.

2. **Proposed approach:** use Next.js's built-in `after()` API (available in the Next.js version already in use) to kick off the pipeline once the webhook has already returned its 200 response to Tally. This keeps the webhook itself fast (matching the existing pattern) while letting the real work run longer in the background.

3. **Real open risk, not silently assumed away:** `after()`'s actual execution time allowance depends on the hosting platform's function duration limits (Vercel's plan-dependent). This needs to be verified against your actual Vercel plan before assuming the full pipeline can complete this way — if it can't, the fallback is breaking the pipeline into multiple shorter, chained steps (each triggering the next) rather than one long-running function. Flagged as Task 1, to resolve before building the rest.

4. **Web search mechanism:** Anthropic's API offers a native web search tool for Claude models. This needs to be confirmed against current API documentation before coding (same discipline as verifying Gumroad's and Tally's real API shapes earlier this session) — not assumed from memory.

**Dependencies:** New: Anthropic API (`ANTHROPIC_API_KEY`). Existing: `profiles` table (all fields), MAP-005's engine (becomes the fallback).

---

# Technical Tasks

**0. Verify platform constraints (blocking, do first)**
- Confirm Vercel plan's function duration limit and whether `after()` extends it sufficiently for a multi-minute pipeline. If not, redesign as chained shorter steps before proceeding to task 1.
- Confirm Anthropic's web search tool's actual current API shape (request/response format, how citations/sources come back) against real documentation.

**1. Anthropic client** — `lib/anthropic.ts`: config (API key, throws if missing, same loud-fail pattern as `lib/gumroad.ts`). `services/ai/anthropic-client.ts`: thin wrapper for making a completion request, with and without the web search tool enabled.

**2. Prompt versioning** — `services/calendar/prompts/v1.ts`: the Founder's actual working prompt (provided this session), stored as the versioned baseline, per `system_architecture.md`'s "prompts should be versioned" requirement. Broken into the distinct steps (pillar generation, critique, rebuild, final calendar formatting) as separate prompt templates, not one monolithic string.

**3. Niche research** — `services/calendar/niche-research-service.ts`: `getOrFetchResearch(nicheKey)` — checks `niche_research` table for a fresh (non-stale) entry; if missing/stale, calls the AI client with web search enabled, synthesizes findings, stores with a TTL, returns the result either way.

**4. Pillar generation** — `services/calendar/pillar-generator.ts`: takes profile + niche research, produces draft content pillars.

**5. Critique** — `services/calendar/critique-service.ts`: runs the "cynical veteran" critique prompt against the draft pillars, returns structured feedback (concrete, numeric where possible, per the Founder's original instructions).

**6. Rebuild + calendar generation** — `services/calendar/calendar-builder.ts`: incorporates critique, generates the final 30 items with Due Dates anchored to `profiles.start_date`, spaced per `posting_frequency_type/count`.

**7. Pipeline orchestrator** — `services/calendar/pipeline.ts`: runs tasks 3–6 in order, handles per-step failure (log, mark batch as failed rather than partially storing), creates a `calendar_batches` row with `review_status = 'pending_review'` and 30 `content_calendar_items` rows on success.

**8. Trigger wiring** — `app/api/webhooks/tally/route.ts`: after the existing webhook logic sets `onboarding_complete = true`, use `after()` to invoke the pipeline without delaying the webhook's own response.

**9. Repositories** — `repositories/niche-research.repository.ts`, `calendar-batch.repository.ts`, `calendar-item.repository.ts`.

**10. Fallback-aware lookup** — extend the existing recommendation logic: a new `services/calendar/todays-task-resolver.ts` checks for an approved calendar item matching today's date first; falls back to MAP-005's engine (`services/decision-engine/engine.ts`) only if none exists. `app/(dashboard)/today/page.tsx` and `app/api/recommendation/route.ts` both route through this resolver instead of calling the engine directly.

**11. Founder review — internal gate (no new role system)** — matches the codebase's existing precedent (MAP-002 task 12: lowest-footprint option, no new admin infrastructure). Proposal: a `FOUNDER_EMAIL` env var; a route checks the authenticated user's email against it before allowing access. Flagged for your confirmation — this is a real, if minimal, security boundary and worth you explicitly agreeing to before it's built this way.

**12. Founder review UI** — `app/(internal)/calendar-review/page.tsx`: lists `pending_review` batches (creator name, generated date, niche), with Approve/Reject actions. `app/api/internal/calendar-review/route.ts`: `PATCH` endpoint, Founder-only, sets `review_status` to `approved` or `rejected`. Rejecting does not auto-regenerate in this version — flagged as a manual re-trigger for now (re-running the pipeline is out of this IP's scope to automate further).

---

# File Changes

```
lib/
  anthropic.ts

services/
  ai/
    anthropic-client.ts
  calendar/
    prompts/
      v1.ts
    niche-research-service.ts
    pillar-generator.ts
    critique-service.ts
    calendar-builder.ts
    pipeline.ts
    todays-task-resolver.ts
    README.md

repositories/
  niche-research.repository.ts
  calendar-batch.repository.ts
  calendar-item.repository.ts

app/
  api/
    webhooks/
      tally/
        route.ts              # extended, not replaced
    recommendation/
      route.ts                # extended to use todays-task-resolver
    internal/
      calendar-review/
        route.ts
  (dashboard)/
    today/
      page.tsx                # extended to use todays-task-resolver
  (internal)/
    calendar-review/
      page.tsx

supabase/
  migrations/
    000007_create_calendar_tables.sql

types/
  calendar.ts
```

---

# Database Migration (proposed shape, exact SQL in the actual review pass)

- `niche_research` — `id`, `niche_key text unique`, `research_content text`, `generated_at timestamptz`, `stale_after timestamptz`.
- `calendar_batches` — `id`, `creator_id uuid references profiles(id)`, `review_status text check (in pending_review/approved/rejected)`, `created_at`, `approved_at`, `approved_by`.
- `content_calendar_items` — `id`, `batch_id uuid references calendar_batches(id)`, `day_number int`, `content_title text`, `due_date date`, `platform text`, `type text`, `tags text`, `goal_cta text`, `value_ladder_stage text`, `story_hook text`, `prompt text`, `status text default 'Idea'`.
- RLS: creators can read their own `calendar_batches`/`content_calendar_items` only where `review_status = 'approved'` — a `pending_review` batch must not be readable by the creator even via direct API access, not just hidden in the UI.

---

# API Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/recommendation` | Session | Now routes through todays-task-resolver |
| `GET /api/calendar/today` | Session | New, returns today's approved calendar item or null |
| `PATCH /api/internal/calendar-review` | Founder-only (email match) | Approve/reject a batch |

---

# Testing Requirements

**Unit tests:** Each pipeline step tested in isolation with mocked AI responses. `todays-task-resolver` tested for correct fallback behavior (no batch, pending batch, approved batch — three distinct cases). Due-date calculation tested against various `start_date`/`posting_frequency` combinations.

**Integration tests:** Full pipeline run against a real (or sandboxed) Anthropic API call for at least one real profile, end-to-end, same rigor as the Gumroad/Tally live tests earlier this session — not just mocked.

**Manual QA:** Founder personally reviews the first several real-generated calendars against what they'd have produced by hand — this is explicitly part of PRD-0007's own quality risk mitigation, not optional polish.

**RLS verification:** Explicit test confirming a creator cannot read another creator's calendar, and cannot read their own `pending_review` batch — same rigor as the profiles RLS fix earlier this session.

---

# Rollout Plan

1. Resolve Task 0 (platform constraints) before writing pipeline code.
2. Apply migration 000007.
3. Build and test the pipeline against one real profile (yours), with your own email as the Founder gate.
4. Review the actual generated output personally before approving the wiring that lets it reach any real creator.
5. Once confident, the trigger wiring (Task 8) goes live for all future onboarding completions.

**Rollback plan:** The `after()`-triggered pipeline can be disabled by removing the trigger call without affecting anything already built (MAP-005 continues serving as the sole fallback, same as today).

---

# Definition of Ready Check

- [x] Exists in backlog (MAP-006)
- [x] PRD approved (PRD-0007)
- [x] Architecture reviewed (with real, named open risks — Task 0)
- [ ] Implementation Package approved — pending
- [x] Dependencies resolved (MAP-003/004/005 complete)
- [x] Acceptance criteria complete (inherited from PRD-0007)

---

# Founder / Engineering Decision

**Decision:** _Pending_

**Reasoning:** _Pending review_

**Date:** _Pending_

**Owner:** Founder