-- Run this in the Supabase SQL editor to create tables from scratch.
-- If upgrading an existing venues table from text id, run first:
--   ALTER TABLE venues DROP COLUMN id CASCADE;
--   ALTER TABLE venues ADD COLUMN id bigserial PRIMARY KEY;
-- The app expects exactly these column names.

create table if not exists venues (
  id             bigserial primary key,
  group_name     text,
  venue_name     text,
  region         text default 'UAE',
  revenue        numeric default 0,
  fin_score      numeric default 0,
  red_score      numeric default 0,
  mezza_score    numeric,
  ceiling_pct    integer default 0,
  lending_amt    numeric default 0,
  votes_required integer default 0,
  pilot          numeric default 0,
  p1             numeric default 0,
  p2             numeric default 0,
  analyst        text,
  poc            text,
  case_date      text,
  location       text,
  sheet_url      text,
  strengths      jsonb default '[]',
  weaknesses     jsonb default '[]',
  decision       text,
  rationale      text
);

create table if not exists groups (
  name             text primary key,
  decision         text default 'Pending',
  rationale        text default '',
  disb_mode        text default 'Recommended',
  custom_amt       numeric default 0,
  p1_amt           numeric default 0,
  p2_amt           numeric default 0,
  pilot_disbursed  numeric default 0,
  p1_disbursed     numeric default 0,
  p2_disbursed     numeric default 0
);

create table if not exists tracker (
  group_name  text primary key,
  status      text default '',
  pilot_amt   numeric default 0,
  pilot_date  text,
  p1_amt      numeric default 0,
  p1_date     text,
  p2_date     text,
  notes       text default ''
);

create table if not exists profiles (
  id    uuid references auth.users primary key,
  email text
);

-- RLS: allow authenticated users to read and write all tables
alter table venues  enable row level security;
alter table groups  enable row level security;
alter table tracker enable row level security;
alter table profiles enable row level security;

create policy "auth read venues"   on venues  for select using (auth.role() = 'authenticated');
create policy "auth write venues"  on venues  for all    using (auth.role() = 'authenticated');
create policy "auth read groups"   on groups  for select using (auth.role() = 'authenticated');
create policy "auth write groups"  on groups  for all    using (auth.role() = 'authenticated');
create policy "auth read tracker"  on tracker for select using (auth.role() = 'authenticated');
create policy "auth write tracker" on tracker for all    using (auth.role() = 'authenticated');
create policy "own profile"        on profiles for all   using (auth.uid() = id);
