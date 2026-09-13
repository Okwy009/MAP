# Onboarding service (MAP-004, Tally integration)

Implements PRD-0005 v1.0 / IP-0005. No native form — the existing Tally form
(`https://tally.so/r/zxjJMR` — not `tally.so/forms/zxjJMR`, which is the
owner-only editor URL, login-gated) is the UI; MAP only receives its webhook.

## Layering

```
app/api/webhooks/tally/route.ts             Route        parses, orders the steps, status codes
        │
services/onboarding/tally-verify.ts         verification formId match only (FR4 — see below)
services/onboarding/tally-domain-service.ts pure         raw Tally fields -> UpdateProfileInput
services/onboarding/completion.ts           pure         Profile -> {percent, missingFields, isComplete}
repositories/creator.repository.ts          Repository   email -> creator id (reused from MAP-002)
repositories/profile.repository.ts          Repository   partial-update persistence (reused from MAP-003)
repositories/processed-tally-submission.repository.ts     idempotency ledger (mirrors processed_sales)
```

## Security: no signature, formId match only

A cryptographic signing secret was investigated directly against the live
Tally integration and found unavailable on the current plan. FR4 accepts a
lower trust bar than Gumroad's webhook as an explicit, logged tradeoff — the
worst case of a forged submission is bad profile data, not fraud (no money
moves through this webhook). `TALLY_FORM_ID` (env, not a secret — it's the
public form ID) is the only check.

## Field mapping — confirmed against Tally's own docs, not the payload IP-0005 references

IP-0005 says the mapping table below was "confirmed against a real captured
payload" from a prior session. That payload isn't in this repo — I verified
the _envelope/field shape_ independently against Tally's documentation
(tally.so/help/webhooks, developers.tally.so) before writing the mapper:
`data.fields[]`, each `{ key, label, type, value, options? }`; for a
choice-type field `value` is an array of selected option IDs (even
single-select) and `options` is `{ id, text }[]`. The specific
key-to-question mapping below is project-specific to this one form and comes
straight from IP-0005's own table (no external source could verify that
part).

| Tally key                             | MAP field                   | Handling                                                                 |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `question_8Q9o7l` + `question_064rN9` | `full_name`                 | Concatenate first + last                                                 |
| `question_zDVXPk`                     | _(email match, not stored)_ | Lookup creator by email                                                  |
| `question_XWj5BO`                     | `creator_type`              | Option ID → text; "n/a" → null                                           |
| `question_P0GXL0`                     | `subscriber_count`          | Parse int; "n/a" → null                                                  |
| `question_8Q9NpA`                     | `platform`                  | Option ID(s) → text                                                      |
| `question_064VjZ`                     | `priority_platform`         | Direct; "n/a" → null                                                     |
| `question_lWlOLo`                     | `profile_link`              | Direct                                                                   |
| `question_zDVEQ1`                     | `focus_area` (topics)       | Direct; "n/a" → null                                                     |
| `question_51NXqM`                     | `audience`                  | Direct; "n/a" → null                                                     |
| `question_DdLqvb`                     | `primary_goal`              | Direct; "n/a" → null                                                     |
| `question_P5oRBQ`                     | `posting_frequency_type`    | Option ID → text                                                         |
| `question_ze1QVZ`                     | `posting_frequency_count`   | Parse int; "n/a" → null                                                  |
| `question_rEkdRL`                     | `newsletter_cadence`        | Direct; "n/a" → null                                                     |
| `question_xZl0Yy`                     | `ai_preference` (bool)      | "Yes" option selected → true; unanswered → null (not false)              |
| `question_xyNJpG`                     | `start_date`                | Direct (ISO)                                                             |
| `question_lNPB0B`                     | `tone`                      | Direct; "n/a" → null                                                     |
| `question_R5OWBp`                     | `review_cadence`            | Option ID → text                                                         |
| `question_oMJ9VX`                     | `desired_impact`            | Direct; "n/a" → null                                                     |
| `question_GdMeB2`                     | `newsletter_consent` (bool) | "Yes (Share)" selected → true; unanswered → omitted (column is NOT NULL) |

**Known gap: `newsletter_days` has no mapped key.** The migration adds the
column (conditional field — only relevant for weekly cadence), but IP-0005's
table doesn't name which Tally question fills it. Rather than guess a
`question_XXXXX` key with zero evidence, `tally-domain-service.ts` never
populates it — it stays null until a real key is confirmed. Excluded from
`onboarding_complete`'s required-fields check for exactly this reason (see
`completion.ts`); still shown in the checklist's missing-fields list for
transparency.

**Ignored entirely:** the redundant per-option `question_X_optionId: true/false` entries Tally also sends alongside choice fields.

## Overwrite semantics (FR7) — different from `PATCH /api/profile`

A Tally resubmission _overwrites_ previously-submitted answers (FR7) — the
mapper includes essentially every field on every submission, nulling out
anything now unanswered/"n/a". This is deliberately different from
`PATCH /api/profile` (MAP-003), where an omitted field is left untouched.
`profile.repository.ts#updateProfile` itself doesn't know or care which
caller it's serving — it stays a dumb partial-updater; the _difference in
behavior_ comes entirely from what each caller chooses to put in the patch
object.

## Status

Built (IP-0005 tasks 1–8): migration, domain mapping, formId verification,
webhook receiver, idempotency, completion percentage endpoint, checklist
widget (excluded for `migrated_from_manual` creators per FR9), and
`onboarding_complete` auto-set.

Not built (explicitly out of this pass, per the Rollout Plan, not the
Technical Tasks list): drafting/sending the migrated-creator reminder email —
its copy needs Founder review before going to real people.
