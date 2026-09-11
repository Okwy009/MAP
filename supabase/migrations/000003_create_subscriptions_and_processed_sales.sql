-- MAP-002 Payment Integration (Gumroad, Phase 1). See PRD-0002 v3.0 / IP-0002.
-- Does not modify 000001 (profiles) or 000002 (migration columns).

create table subscriptions (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null unique references profiles (id) on delete cascade,
  tier            text not null check (tier in ('starter', 'pro', 'creator_plus')),
  status          text not null default 'active' check (status in ('active', 'inactive')),
  gumroad_sale_id text unique,          -- null for comped access; unique when present
  purchased_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index subscriptions_status_idx on subscriptions (status);

alter table subscriptions enable row level security;

-- Creators may read only their own subscription. No insert/update/delete policy:
-- writes go through the service role, which bypasses RLS (server-side only).
create policy "Creators read own subscription" on subscriptions
  for select using ((select auth.uid()) = creator_id);

comment on table subscriptions is
  'One paid (or comped) access record per creator. Phase 2 (Stripe) reuses this table with added nullable id columns.';
comment on column subscriptions.gumroad_sale_id is
  'Gumroad sale id for a real purchase; null for migrated_from_manual free-access creators.';

create table processed_sales (
  sale_id      text primary key,        -- Gumroad sale id; idempotency key (IP-0002 task 5)
  processed_at timestamptz not null default now()
);

alter table processed_sales enable row level security;
-- No policies at all: service-role only, never client-visible.

comment on table processed_sales is
  'Ledger of Gumroad sale ids already handled by the Ping receiver. Idempotency only.';

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger subscriptions_set_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();
