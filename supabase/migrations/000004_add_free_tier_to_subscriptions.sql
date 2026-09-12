-- Freemium pivot — decision_log.md "Freemium pivot" / "MAP Experience stages"
-- (2026-09-12), pricing.md v3. Does not modify 000003.

alter table subscriptions
  drop constraint subscriptions_tier_check;

alter table subscriptions
  add constraint subscriptions_tier_check
  check (tier in ('free', 'starter', 'pro', 'creator_plus'));
