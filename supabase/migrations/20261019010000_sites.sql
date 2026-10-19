-- Sites built in the dashboard. Each user has one site; once published it is
-- served publicly at <domain>/<slug>.
--
--   content            the draft the owner is editing (saved from the dashboard)
--   published_content  the snapshot visitors see; only changes when publishing
--
-- Visitors never read this table directly: they go through
-- get_published_site(), so drafts stay private.

-- Paths the app itself uses (keep in sync with the routes in src/App.tsx).
create function public.is_reserved_slug(p_slug text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_slug = any (array[
    'login', 'signup', 'dashboard', 'language', 'api', 'admin', 'auth',
    'assets', 'static', 'public', 'app', 'www', 'settings', 'account',
    'help', 'about', 'terms', 'privacy', 'index', 'memoriz', 'maryem-birthday-site'
  ]);
$$;

-- 3–40 chars: lowercase letters, digits and hyphens, not starting/ending with a hyphen.
create function public.is_valid_slug(p_slug text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'
     and p_slug !~ '--'
     and not public.is_reserved_slug(p_slug);
$$;

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  slug text unique check (slug is null or public.is_valid_slug(slug)),
  lang text not null default 'en' check (lang in ('en', 'fr')),
  content jsonb not null default '[]'::jsonb,
  published_content jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sites enable row level security;

create policy "Owners can read their site"
  on public.sites for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owners can create their site"
  on public.sites for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owners can update their site"
  on public.sites for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Owners can delete their site"
  on public.sites for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- Used by the publish dialog. Returns one of:
--   'available' | 'yours' (already your URL) | 'taken' | 'reserved' | 'invalid'
create function public.check_slug(p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_reserved_slug(p_slug) then 'reserved'
    when not public.is_valid_slug(p_slug) then 'invalid'
    when exists (select 1 from public.sites s where s.slug = p_slug and s.owner_id = auth.uid()) then 'yours'
    when exists (select 1 from public.sites s where s.slug = p_slug) then 'taken'
    else 'available'
  end;
$$;

-- Public read of a published site by its URL. Returns no row if the slug is
-- unknown or not published yet.
create function public.get_published_site(p_slug text)
returns table (slug text, lang text, content jsonb, published_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select s.slug, s.lang, s.published_content, s.published_at
  from public.sites s
  where s.slug = p_slug
    and s.published_content is not null;
$$;

revoke execute on function public.check_slug(text) from public, anon;
grant execute on function public.check_slug(text) to authenticated;
grant execute on function public.get_published_site(text) to anon, authenticated;
