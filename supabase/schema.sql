-- The Mingle, kept small on purpose.
-- This database is shared and on the free plan, so The Mingle uses one table
-- and does not create events, attendees, or other generic names that could
-- collide with another project.
-- The anon key cannot read this table. The Next.js server uses the service role.

create table if not exists public.mingle_app (
  id text primary key,
  document jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.mingle_app enable row level security;

revoke all on table public.mingle_app from anon, authenticated;
