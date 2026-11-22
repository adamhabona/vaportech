-- Small key/value store. Used by test mode for the mock Clover register so
-- fake orders are shared across serverless instances.
create table if not exists rewards_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table rewards_kv enable row level security;
