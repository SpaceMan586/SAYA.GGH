-- Run this once in Supabase SQL Editor.
alter table public.news
add column if not exists gallery_urls text[] default '{}'::text[];
