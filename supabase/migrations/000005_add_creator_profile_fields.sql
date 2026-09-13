-- MAP-003 Creator Profile (PRD-0004 / IP-0004). Does not touch 000001-000004.
--
-- "topics" intentionally omitted per Founder decision (2026-09-12): focus_area
-- (000002) already covers this, populated for all 20 migrated creators.

alter table profiles
  add column creator_type text,
  add column platform text,
  add column audience text,
  add column tone text,
  add column publishing_cadence text,
  add column primary_goal text,
  add column ai_preference text,
  add column review_cadence text,
  add column onboarding_complete boolean not null default false;

-- ---------------------------------------------------------------------------
-- RLS fix, beyond IP-0004's literal scope (flagged for review, not silent).
-- IP-0004 states the existing profiles RLS "already scopes by row ... which
-- covers all columns automatically." True for insert/update, not for select:
-- 000001's select policy is `using (true)` -- fully public reads of every
-- column, for every creator. PRD-0004 FR4 requires reads scoped to "never
-- another creator's," which now matters for the sensitive fields added above
-- (audience, tone, primary_goal, ai_preference). Tightening to match FR4.
-- Not destructive to data -- access rule only. Nothing in this app currently
-- reads another user's profile via the anon/authenticated client (checked).
-- ---------------------------------------------------------------------------
drop policy "Public profiles are viewable by everyone." on profiles;

create policy "Creators read own profile" on profiles
  for select using ((select auth.uid()) = id);
