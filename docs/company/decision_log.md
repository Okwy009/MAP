# Decision Log — New Entries

> Append these entries to `decision_log.md`.

---

## Decision

**Date:** 2026-09-03

**Owner:** Founder

**Question:** Should PRD-0001 (User Authentication) be approved, including a migration path for existing manually-onboarded creators?

**Decision:** Approved. Authentication will use Supabase Magic Link (passwordless), per existing architecture. Existing manually-onboarded creator(s) will be migrated into real accounts with their existing context preserved, rather than re-onboarded from zero (FR11).

**Reasoning:** Authentication is the foundation every other MVP feature (MAP-002 through MAP-008) depends on. The approach follows already-approved architecture (AD-002, AD-003) with no new technology introduced. Migrating existing creators protects the relationship and context already built manually, consistent with reducing cognitive load for the user.

**Alternatives Considered:**
- Password-based authentication — rejected (adds friction and support burden, conflicts with cognitive-load principle).
- OAuth-only at MVP — rejected for now (unnecessary complexity before it's needed; deferred to a future phase).
- Requiring existing manually-onboarded creators to sign up fresh with no migration — rejected by Founder in favor of preserving context.

**Trade-offs:** Migration adds one extra engineering task (a one-time script) and one added functional requirement, in exchange for not losing the relationship/context already built with the first real user.

**Expected Outcome:** MAP-001 (User Authentication) proceeds to Implementation Package, then Engineering, as the first feature built in the MVP.

**Actual Outcome:** _(update later, post-release)_

**Related Documents:** PRD-0001-User-Authentication.md, mvp_backlog.md, 02_authentication.md, system_architecture.md

**Status:** Active

---

## Decision

**Date:** 2026-09-03

**Owner:** Founder

**Question:** Should IP-0001 (Implementation Package for User Authentication) be approved, authorizing engineering to begin?

**Decision:** Approved. MAP-001 moves to "In Development" — the first feature MAP is authorized to build.

**Reasoning:** The Implementation Package follows approved architecture (Supabase, Next.js App Router, layered service structure) with scope matching PRD-0001 exactly — no additions or deviations. All Definition of Ready conditions are satisfied: backlog entry exists, PRD approved, architecture reviewed, dependencies resolved (none — first feature), acceptance criteria complete.

**Alternatives Considered:** None — package matched the approved PRD directly; no alternative implementation approaches were proposed.

**Trade-offs:** None identified. This is the first feature built, so no competing priorities were traded off.

**Expected Outcome:** Engineering begins on MAP-001 per IP-0001's task list, starting with repository skeleton and Supabase project setup, followed by the manual-creator migration as the first rollout stage.

**Actual Outcome:** _(update later, post-release)_

**Related Documents:** IP-0001-User-Authentication.md, PRD-0001-User-Authentication.md, 03_development_workflow.md

**Status:** Active

---

## Decision

**Date:** 2026-09-06

**Owner:** Founder

**Question:** Is MAP-001 (User Authentication) complete and ready to be marked Done?

**Decision:** Yes. MAP-001 acceptance criteria verified end-to-end by manual test: sign up with email → Magic Link received → clicked → landed authenticated on a protected route (/tracker) → signed out → confirmed protected routes correctly redirect to /auth/login afterward, with no stale session. Migration (000001_create_profiles_table.sql) confirmed applied with RLS enabled (3 policies active) via Supabase dashboard.

**Reasoning:** This is the first MAP feature to go from documentation through implementation to a real, human-verified working state — not just code that compiles. Every functional requirement in PRD-0001 relating to the core auth flow (FR1, FR2, FR3, FR5, FR6, FR8) was exercised directly, not assumed from a code trace.

**Alternatives Considered:** N/A — this entry records verification, not a design choice.

**Trade-offs:** None. One item remains open, tracked separately: FR11 (migrating the existing manually-onboarded creator into a real account) has not yet been executed — the auth system supports it, but the actual migration hasn't run.

**Expected Outcome:** MAP-001 status moves to Done in mvp_backlog.md. Engineering moves to PRD-0002 (Payment Integration), next in build order.

**Actual Outcome:** Confirmed working as expected — no deviation.

**Related Documents:** PRD-0001-User-Authentication.md, IP-0001-User-Authentication.md, docs/product/mvp_backlog.md

**Status:** Active

---
## Decision

**Date:** 2026-09-06

**Owner:** Founder

**Question:** Should the 20 existing manually-onboarded creators (from the Notion Client Intake Log) be migrated into real MAP accounts, per FR11 of PRD-0001?

**Decision:** Approved and executed. All 20 creators were migrated via a one-time backfill script using Supabase's Admin API (`auth.admin.createUser` with `email_confirm: true`), so no sign-in email was sent to anyone. Each received a `profiles` row with `full_name`, `migrated_from_manual = true`, and `focus_area` populated from their Notion intake data. Result: 20 created, 0 already existed, 0 failures.

**Reasoning:** These are real, existing relationships with context already gathered by the founder (via the Notion Client Intake Log). Creating accounts silently, rather than sending 20 unexplained sign-in emails at once, preserves the relationship and avoids confusing or alarming people who didn't ask for an account yet. Each creator will receive a normal Magic Link only the first time they're actually invited to sign in.

**Alternatives Considered:** Migrating only the single most-recent creator (the original FR11 scope) — superseded once the founder confirmed all 20 Client Intake Log entries should be migrated together. Sending each creator an immediate sign-in email — rejected in favor of silent account creation to avoid confusing 20 people with an unexpected email.

**Trade-offs:** Required elevated (service-role) database access for a one-time script, which is more powerful and higher-risk than the anon key used elsewhere in the app. Mitigated by: never storing the key in git-tracked files, deleting the one-time script immediately after use, and removing the key from .env.local once the job was done.

**Expected Outcome:** 20 real accounts exist and are ready for their owners to sign in with their own email whenever the founder invites them. FR11 of PRD-0001 is now fully satisfied — MAP-001 has no remaining open items.

**Actual Outcome:** Confirmed via script output and Supabase Table Editor: 20/20 created, 0 failures, migration columns correctly added via a separate migration file (000002) without touching the original 000001 migration.

**Related Documents:** PRD-0001-User-Authentication.md, IP-0001-User-Authentication.md, supabase/migrations/000002_add_migration_columns_to_profiles.sql

**Status:** Active

---

## Decision

## Decision

**Date:** 2026-09-06

**Owner:** Founder

**Question:** What payment provider should MAP-002 use for MVP?

**Decision:** Gumroad for Phase 1 (this build), restoring the original AD-004 decision. Stripe is confirmed as the Phase 2 target, to be adopted once MAP is registered as a US business entity. PRD-0002 approved at v3.0.

**Reasoning:** Gumroad requires no blocking prerequisite and can ship now. Stripe cannot be used for Phase 1 because it does not support direct merchant accounts or bank payouts for Nigerian-registered businesses — a real structural limitation, not a temporary one, confirmed via research rather than assumed. Grey was investigated directly as a possible automated alternative and found not to offer checkout or subscription-billing infrastructure — it's a multi-currency receiving account, not a payment gateway. A fully manual process (creators paying into Grey directly, founder manually confirming) was drafted as a stopgap but set aside once it was clear Gumroad itself had no blocking prerequisite, making the manual route unnecessary.

**Alternatives Considered (in the order they were actually evaluated):**
1. Stripe (automated) — desired long-term, blocked by Nigerian entity/payout restrictions.
2. Grey (automated, as a second parallel provider alongside a first choice) — set aside early to avoid maintaining two payment integrations before either was proven.
3. Stripe only, replacing Gumroad entirely — approved in principle, then found to be blocked by the same Nigerian payout restriction discovered afterward.
4. Manual payment via Grey (founder-confirmed) — fully specified in PRD-0002 v2.0 as a Phase 1 stopgap while Stripe was blocked.
5. **Gumroad (automated) — final decision.** Once reconsidered, had no blocking prerequisite at all, making it strictly better than the manual stopgap for Phase 1, while Stripe remains the Phase 2 goal once the US entity exists.

**Trade-offs:** Choosing Gumroad now means a real migration effort later when Stripe becomes viable (new provider adapter, re-pointed checkout, re-tested webhooks) — accepted in exchange for shipping real, automated revenue capability immediately rather than waiting on business registration or building a manual process that doesn't scale.

**Expected Outcome:** MAP-002 proceeds to Implementation Package on Gumroad. AD-004 updated to reflect the two-phase plan. No blocking prerequisite before engineering starts (unlike the Stripe-first path, which was blocked on US registration).

**Actual Outcome:** _(update later, post-release)_

**Related Documents:** PRD-0002-Payment-Integration.md (v3.0), AD-004-Gumroad-Phase1-Stripe-Phase2.md, system_architecture.md §23 (Payment Flow), pricing.md

**Status:** Active

---

## Decision

**Date:** 2026-09-11

**Owner:** Founder

**Question:** Is MAP-002 (Payment Integration) code-complete against IP-0002?

**Decision:** Yes. All 13 technical tasks in IP-0002 are built, individually tested against real modules (not just mocked assumptions), and reviewed. Migration 000003 applied to the live database. The founder-lookup query verified against all 20 real migrated creator records, correctly showing free — migrated status with null subscription fields.

**Reasoning:** Every task was verified with real evidence before being marked done — real Gumroad API calls (product ID, variant structure, checkout URL behavior), real database writes, real entitlement logic tested against edge cases (migrated + active sub conflict, refund on a DB failure, superseded-sale gap). Two real spec-vs-reality mismatches were caught and corrected before they became runtime bugs: the assumed three-Gumroad-products structure (actually one product with three tiers), and the assumed pre-existing Resend integration from MAP-001 (never actually built). A middleware bug that would have made the entire webhook endpoint unreachable was caught in testing, not in production.

**Alternatives Considered:** N/A — this entry records completion status, not a design choice.

**Trade-offs:** Email delivery (task 11) is built but inert — cannot actually send until a Resend account and verified sending domain exist. The post-purchase "Continue to MAP" link is hardcoded to localhost, non-functional for real customers until deployment. Both are known, logged limitations (known_issues.md), not oversights.

**Expected Outcome:** MAP-002 is ready for a genuine end-to-end paid-purchase test once deployed, mirroring how MAP-001's Magic Link flow was manually verified by a real human before being marked Done.

**Actual Outcome:** _(update after first real end-to-end purchase test)_

**Related Documents:** PRD-0002-Payment-Integration.md (v3.0), IP-0002-Payment-Integration.md, services/payments/README.md, docs/known_issues.md, supabase/migrations/000003_create_subscriptions_and_processed_sales.sql

**Status:** Active

---

## Decision

**Date:** 2026-09-12

**Owner:** Founder

**Question:** What defines each pricing tier's value, beyond price points alone?

**Decision:** MAP's four tiers map to four progressive "stages" of the product experience, each building on the last: Stage 1 (Free) = Dashboard + 30-Day Plan via the deterministic Decision Engine; Stage 2 (Starter, $19) = adds the Engagement Tracker (completion tracking, input tracking, weekly review); Stage 3 (Pro, $49) = adds adaptive AI recommendations, deliberately gated on Stage 2's tracked history existing first; Stage 4 (Creator+, $99) = adds multi-platform content distribution (Substack, Instagram, TikTok, etc.).

**Reasoning:** This structure isn't arbitrary feature bundling — it mirrors AD-007's existing architectural principle that adaptive AI should only activate once real execution history exists, meaning Stage 3 is technically dependent on Stage 2, not just priced above it. This gives the tier ladder both a business logic and a technical logic that reinforce each other.

**Alternatives Considered:** Collapsing Starter and Pro into a single "Tier 1" stage, with Creator+ as "Tier 2" — rejected in favor of preserving all three original paid price points, since Creator+ needed its own distinct capability (multi-platform distribution) rather than folding into the AI tier.

**Trade-offs:** Stage 4 (multi-platform distribution) requires a new architecture component not currently defined anywhere in system_architecture.md — this is real new scope, not a repackaging of existing planned work, and is meaningfully more complex/AI-dependent than the other three stages. It should not be built until Stages 1-3 are validated with real users.

**Expected Outcome:** pricing.md updated to reflect the 4-stage structure (v3). This becomes the reference model for scoping MAP-005 onward (Decision Engine, Completion/Input Tracking, AI Architecture) and a future PRD for the Stage 4 Distribution Service.

**Actual Outcome:** _(update once Stages 1-3 are built and the tier structure is validated with real users)_

**Related Documents:** pricing.md (v3), system_architecture.md (AD-007, §17-31), decision_log.md ("Freemium pivot," same date), mvp_backlog.md

**Status:** Active

---

## Decision

**Date:** 2026-09-12

**Owner:** Founder

**Question:** Should PRD-0003 (Landing Page) be built, or is it superseded by the auth-aware homepage fix?

**Decision:** Closed — not built. Superseded by the homepage rebuild (app/page.tsx), which directly resolved the "too direct" signup problem this PRD was written for.

**Reasoning:** The homepage fix shipped a real, working solution to the concrete problem faster than the fuller landing page would have, and covers the practical need for now (auth-aware navigation, clear Sign In/Sign Up entry points). PRD-0003's more ambitious marketing-page vision (headline copy, "how it works" explanation, pricing teaser) remains a reasonable idea but is not the current priority.

**Alternatives Considered:** Building the full PRD-0003 landing page anyway — rejected as unnecessary scope right now, given the homepage fix already resolved the observed problem.

**Trade-offs:** MAP still doesn't have a fuller marketing/value-proposition page for cold, un-authenticated traffic (e.g. someone arriving from a social share with zero context on MAP). This is accepted as a future consideration, not a current gap that blocks anything.

**Expected Outcome:** PRD-0003 is marked Closed in docs/product/prds/. No further work planned unless real traffic patterns later show the minimal homepage copy is insufficient.

**Actual Outcome:** _(revisit if cold-traffic conversion becomes a concern later)_

**Related Documents:** PRD-0003-Landing-Page.md (Closed), app/page.tsx (the superseding fix)

**Status:** Active

---

## Decision

**Date:** 2026-09-12

**Owner:** Founder

**Question:** The `profiles` table's SELECT policy (set in migration 000001) allows `using (true)` — any row, all columns, publicly readable. Should this be fixed as part of MAP-003?

**Decision:** Yes. Fixed in migration 000005, alongside the Creator Profile column additions. New policy: `for select using ((select auth.uid()) = id)` — creators may read only their own profile.

**Reasoning:** The original public-read policy was likely harmless when `profiles` held only `username`/`avatar_url`, but MAP-003 adds real personal context (audience, tone, primary_goal, ai_preference) that should never have been publicly readable in the first place. This was discovered during MAP-003 implementation, not through a dedicated security audit — a reminder that RLS policies need re-evaluation whenever a table's contents change meaningfully, not just when a table is first created.

**Alternatives Considered:** Leaving the fix for a separate, dedicated security pass — rejected; the exposure is real and already live in production, so it should close as soon as it's found rather than staying open while its own PRD's scope is debated.

**Trade-offs:** None identified. Verified before applying that nothing in the current codebase relies on reading another user's profile via the RLS-scoped (non-service-role) client — the fix is a pure correction with no functional side effects.

**Expected Outcome:** From the moment migration 000005 is applied, no creator's profile is readable by anyone except themselves (server-side/service-role access, used for legitimate purposes like the Gumroad email-matching lookup, is unaffected — it deliberately bypasses RLS by design).

**Actual Outcome:** _(confirm after migration 000005 is applied — verify via a test query that a creator cannot read another creator's profile through the normal client)_

**Related Documents:** supabase/migrations/000005_add_creator_profile_fields.sql, supabase/migrations/000001_create_profiles_table.sql (original policy), PRD-0004-Creator-Profile.md

**Status:** Active

---

