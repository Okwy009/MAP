-- Adds columns supporting the one-time backfill of creators brought over from the
-- manual (pre-product) accountability process.
-- Paired with scripts/migrate-manual-creators.ts (one-time; removed after running).

alter table profiles
  add column if not exists migrated_from_manual boolean not null default false,
  add column if not exists focus_area text;

comment on column profiles.migrated_from_manual is
  'True for accounts created by the manual-creator backfill rather than self sign-up.';
comment on column profiles.focus_area is
  'Free-text content focus captured during the manual process. Nullable.';
