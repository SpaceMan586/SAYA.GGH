-- Run this in the Supabase SQL Editor after you have marked your real admin
-- users with app_metadata.role = 'admin'.
--
-- Example admin bootstrap, run once with your actual admin email:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'admin@example.com';

begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', '') = 'true';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.ai_knowledge enable row level security;
alter table public.news enable row level security;
alter table public.page_content enable row level security;
alter table public.projects enable row level security;
alter table public.team enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Allow authenticated users to manage ai_knowledge" on public.ai_knowledge;
drop policy if exists "Allow authenticated users to manage news" on public.news;
drop policy if exists "Allow authenticated users to manage page_content" on public.page_content;
drop policy if exists "Allow authenticated users to manage projects" on public.projects;
drop policy if exists "Allow authenticated users to manage team" on public.team;

drop policy if exists "Public can read news" on public.news;
drop policy if exists "Public can read page_content" on public.page_content;
drop policy if exists "Public can read projects" on public.projects;
drop policy if exists "Public can read team" on public.team;
drop policy if exists "Admins can manage ai_knowledge" on public.ai_knowledge;
drop policy if exists "Admins can manage news" on public.news;
drop policy if exists "Admins can manage page_content" on public.page_content;
drop policy if exists "Admins can manage projects" on public.projects;
drop policy if exists "Admins can manage team" on public.team;
drop policy if exists "Admins can manage chat_sessions" on public.chat_sessions;
drop policy if exists "Admins can manage chat_messages" on public.chat_messages;

create policy "Public can read news"
on public.news
for select
to anon, authenticated
using (true);

create policy "Public can read page_content"
on public.page_content
for select
to anon, authenticated
using (true);

create policy "Public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

create policy "Public can read team"
on public.team
for select
to anon, authenticated
using (true);

create policy "Admins can manage ai_knowledge"
on public.ai_knowledge
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage news"
on public.news
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage page_content"
on public.page_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage team"
on public.team
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage chat_sessions"
on public.chat_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage chat_messages"
on public.chat_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Remove anonymous write entrypoints from PostgREST/GraphQL.
revoke insert, update, delete on table public.ai_knowledge from anon;
revoke insert, update, delete on table public.news from anon;
revoke insert, update, delete on table public.page_content from anon;
revoke insert, update, delete on table public.projects from anon;
revoke insert, update, delete on table public.team from anon;
revoke insert, update, delete on table public.chat_sessions from anon;
revoke insert, update, delete on table public.chat_messages from anon;

-- GraphQL introspection hardening:
-- These revokes clear pg_graphql anon table exposure warnings, but anonymous
-- browser reads against these tables will fail afterward. Keep public reads on
-- server routes/components using SUPABASE_SERVICE_ROLE_KEY before enabling this.
--
-- revoke select on table public.ai_knowledge from anon;
-- revoke select on table public.chat_messages from anon;
-- revoke select on table public.chat_sessions from anon;
-- revoke select on table public.news from anon;
-- revoke select on table public.page_content from anon;
-- revoke select on table public.projects from anon;
-- revoke select on table public.team from anon;

commit;
