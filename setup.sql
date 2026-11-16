-- Sign-up Board: database setup
-- Run this whole file in Supabase: SQL Editor > New query > paste > Run.
-- It is safe to run more than once.

-- 1. The table that holds the sign-ups.
create table if not exists public.signups (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 200 and email like '%@%'),
  created_at timestamptz not null default now()
);

-- 2. Turn on the row rules (Row Level Security).
--    With this on, nobody can touch a row unless a rule below allows it.
alter table public.signups enable row level security;

-- 3. The row rules. The public key (anon) may ADD a row and READ rows.
--    There is no rule for changing or deleting, so the public cannot do that.
drop policy if exists "Anyone can add a sign-up" on public.signups;
create policy "Anyone can add a sign-up"
  on public.signups for insert
  to anon
  with check (true);

drop policy if exists "Anyone can read the board" on public.signups;
create policy "Anyone can read the board"
  on public.signups for select
  to anon
  using (true);

-- 4. Table permissions for the public key: add and read only.
grant select, insert on public.signups to anon;
revoke update, delete, truncate on public.signups from anon;

-- 5. FEATURE 3: one sign-up per email, even in capital letters.
--    lower(email) turns ASHA@Example.com into asha@example.com before comparing.
create unique index if not exists signups_email_once
  on public.signups (lower(email));
