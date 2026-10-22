# Decision Engine (MAP-005 MVP)

Implements PRD-0006 v1.0 / IP-0006. Deterministic, no AI (AD-007) — reads a
creator's `profiles` row, returns exactly one `Recommendation`.

## Design: ordered rules, first-match-wins

```
app/api/recommendation/route.ts     Route    session-auth, fetch profile, run engine, log which rule fired
        │
services/decision-engine/engine.ts  pure     ordered RULES list; matchRule() returns the first match
        │
services/decision-engine/rules/
  onboarding-incomplete.ts          pure     matches !onboarding_complete — checked first
  todays-post.ts                    pure     matches() always true — the fallback, must stay last
```

FR8's extensibility requirement: a new rule (task-resume, energy-based,
Recovery Mode — once MAP-006/008 supply the data) is a new file implementing
`Rule` plus one line in `engine.ts`'s `RULES` array, inserted _before_
`todaysPostRule`. No existing rule file changes.

## `todays-post.ts` — missing-field handling is the actual design work here

Every field it reads (`platform`, `focusArea`, `tone`, `postingFrequencyType`,
`primaryGoal`) can be null — sparse and migrated-creator profiles are the norm
at this stage, not an edge case (PRD-0006). Each branch degrades to the
generic-but-still-a-complete-sentence version rather than producing "in your
null tone" or a dangling clause. Verified down to the fully-empty profile
(every field null) still producing a coherent, complete recommendation.

**One deliberate choice, not literal PRD copy:** PRD-0006's worked example
description reads "in your professional founder tone" — a shortened paraphrase
of the actual stored tone value ("Professional, tech founder in his mid-20s").
The rule does **not** attempt to algorithmically shorten/paraphrase arbitrary
tone text — that's unreliable guessing that would break differently for every
real value. It uses whatever `tone` holds verbatim, appended as its own clause
("`, in a {tone} tone`"). This means the rendered description won't match the
PRD's worked example word-for-word when `tone` is long or comma-containing;
it's still coherent, always true to the real stored value, not massaged to
fit one example.

## Explainability (NFR)

`matchRule()` is exposed separately from `generateRecommendation()` so the
route can log which rule fired (`console.info` — `creator`, `rule.id`) without
adding an undocumented field to the `Recommendation` type itself (IP-0006
task 1 specifies its exact shape).

## Status

Built (IP-0006 tasks 1–7): types, rule interface, both MVP rules, engine,
`GET /api/recommendation`, `/today` rebuilt (client fetch, no Complete button
— deferred to MAP-008 per Founder decision).

Deferred, per PRD-0006's own scope (not gaps, explicit Out of Scope): task-resume,
newsletter-day, energy-based, and review-day rules; Recovery Mode; varying
`estimatedDuration` by `posting_frequency_count`.
