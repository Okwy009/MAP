-- MAP-004 Creator Onboarding (PRD-0005 / IP-0005). Does not touch 000001-000005.

alter table profiles
  add column subscriber_count integer,
  add column priority_platform text,
  add column profile_link text,
  add column posting_frequency_type text,
  add column posting_frequency_count integer,
  add column newsletter_cadence text,
  add column newsletter_days text,
  add column start_date date,
  add column desired_impact text,
  add column newsletter_consent boolean not null default false;

-- ai_preference: text -> boolean (the real Tally form only offers Yes/No).
-- Safe: no onboarding submission has ever been processed yet, so every
-- existing value is null (PRD-0005 problem statement / MAP-003 FR6).
alter table profiles
  alter column ai_preference type boolean using (ai_preference::boolean);

create table processed_tally_submissions (
  submission_id text primary key,
  processed_at  timestamptz not null default now()
);

alter table processed_tally_submissions enable row level security;
-- No policies at all: service-role only, mirrors processed_sales (MAP-002).

comment on table processed_tally_submissions is
  'Ledger of Tally submission ids already handled by the onboarding webhook. Idempotency only, mirrors processed_sales.';
