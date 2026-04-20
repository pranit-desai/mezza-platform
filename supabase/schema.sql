-- Run this in the Supabase SQL editor if your tables don't have these columns yet.
-- The app expects exactly these column names.

create table if not exists venues (
  id         text primary key,
  gn         text,
  vn         text,
  rg         text default 'UAE',
  rev        numeric default 0,
  fin        numeric default 0,
  red        numeric default 0,
  mz         numeric,
  ceil       integer default 0,
  la         numeric default 0,
  vr         integer default 0,
  pi         numeric default 0,
  p1         numeric default 0,
  p2         numeric default 0,
  an         text,
  poc        text,
  dt         text,
  loc        text,
  url        text,
  str        jsonb default '[]',
  wk         jsonb default '[]'
);

create table if not exists groups (
  gn               text primary key,
  dec              text default 'Pending',
  rat              text default '',
  mode             text default 'Recommended',
  custom_amt       numeric default 0,
  p1_amt           numeric default 0,
  p2_amt           numeric default 0,
  pilot_disbursed  numeric default 0,
  p1_disbursed     numeric default 0,
  p2_disbursed     numeric default 0
);

create table if not exists tracker (
  gn          text primary key,
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
