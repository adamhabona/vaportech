-- VaporTech Rewards schema.
-- All access goes through the Next.js server with the service role key.
-- RLS is enabled with no policies so the anon key can read nothing.

create table if not exists members (
  id uuid primary key,
  phone text not null unique,
  first_name text not null,
  last_name text not null,
  email text,
  dob date not null,
  referral_code text not null unique,
  qr_token text not null unique,
  wallet_auth_token text not null,
  clover_customer_id text unique,
  id_verified_at timestamptz,
  email_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists points_ledger (
  id uuid primary key,
  member_id uuid not null references members(id) on delete cascade,
  points integer not null,
  reason text not null check (reason in ('signup','purchase','checkin','referral_referrer','referral_referee','streak','spin','redeem','adjust')),
  ref text not null unique,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists points_ledger_member_idx on points_ledger(member_id);

create table if not exists visits (
  id uuid primary key,
  member_id uuid not null references members(id) on delete cascade,
  kind text not null check (kind in ('checkin','purchase')),
  day date not null,
  at timestamptz not null,
  order_id text,
  spend_cents integer,
  categories text[] not null default '{}'
);
create index if not exists visits_member_idx on visits(member_id);

create table if not exists referrals (
  id uuid primary key,
  referrer_id uuid not null references members(id) on delete cascade,
  referee_id uuid not null unique references members(id) on delete cascade,
  status text not null check (status in ('pending','completed','capped')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  order_id text,
  check (referrer_id <> referee_id)
);
create index if not exists referrals_referrer_idx on referrals(referrer_id);
create index if not exists referrals_completed_idx on referrals(completed_at) where status = 'completed';

create table if not exists member_badges (
  member_id uuid not null references members(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (member_id, badge_id)
);

create table if not exists spins (
  id uuid primary key,
  member_id uuid not null references members(id) on delete cascade,
  day date not null,
  prize_id text not null,
  created_at timestamptz not null default now(),
  unique (member_id, day)
);

create table if not exists coupons (
  id uuid primary key,
  member_id uuid not null references members(id) on delete cascade,
  reward_id text not null,
  name text not null,
  kind text not null check (kind in ('amount_off','merch')),
  amount_cents integer,
  min_spend_cents integer,
  source text not null check (source in ('spin','redeem')),
  status text not null check (status in ('active','used','expired')),
  code text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  order_id text
);
create index if not exists coupons_member_idx on coupons(member_id);

create table if not exists order_links (
  order_id text primary key,
  member_id uuid not null references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists wallet_registrations (
  device_id text not null,
  push_token text not null,
  serial text not null,
  pass_type_id text not null,
  created_at timestamptz not null default now(),
  primary key (device_id, serial)
);
create index if not exists wallet_registrations_serial_idx on wallet_registrations(serial);

alter table members enable row level security;
alter table points_ledger enable row level security;
alter table visits enable row level security;
alter table referrals enable row level security;
alter table member_badges enable row level security;
alter table spins enable row level security;
alter table coupons enable row level security;
alter table order_links enable row level security;
alter table wallet_registrations enable row level security;
