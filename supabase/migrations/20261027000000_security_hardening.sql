-- Security hardening.
--
--   1. Least privilege: anon gets no table access; nobody gets TRUNCATE (which
--      ignores RLS), REFERENCES or TRIGGER.
--   2. Slugs: ASCII only, and more reserved words (impersonation, auth paths).
--   3. Site JSON is validated by the database too; mirrors src/lib/content.ts.
--   4. Publishing only through publish_site(): clients can't write slug,
--      published_content or published_at directly, so the public snapshot is
--      always a copy of the owner's validated draft. Rate limited and logged.
--
-- The constraints are added NOT VALID: existing rows are not rechecked now,
-- but every insert/update must pass them.

-- ---- 1. Least privilege ----

revoke all on public.sites from anon;
revoke all on public.profiles from anon;
revoke truncate, references, trigger on public.sites, public.profiles from authenticated;

-- profiles predates these migrations; make sure RLS is on whatever its policies are.
alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, left(coalesce(trim(new.raw_user_meta_data ->> 'name'), ''), 100))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ---- 2. Slugs ----

create or replace function public.is_reserved_slug(p_slug text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_slug = any (array[
    -- app routes (keep in sync with src/App.tsx) and hosting paths
    'login', 'signup', 'dashboard', 'language', 'api', 'admin', 'auth',
    'assets', 'static', 'public', 'app', 'www', 'settings', 'account',
    'help', 'about', 'terms', 'privacy', 'index', 'memoriz', 'maryem-birthday-site',
    'signin', 'sign-in', 'sign-up', 'signout', 'logout', 'register', 'verify',
    'confirm', 'callback', 'oauth', 'reset-password', 'forgot-password',
    'robots', 'favicon', 'sitemap', 'manifest',
    -- names that could pass for the service itself
    'support', 'contact', 'security', 'official', 'team', 'staff', 'billing',
    'pricing', 'blog', 'news', 'docs', 'status', 'legal', 'cookies', 'mail',
    'email', 'root', 'system', 'null', 'undefined'
  ]);
$$;

create or replace function public.is_valid_slug(p_slug text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select octet_length(p_slug) = char_length(p_slug) -- ASCII only
     and p_slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'
     and p_slug !~ '--'
     and not public.is_reserved_slug(p_slug);
$$;

-- Rows keep being checked against is_valid_slug() on every update, so a slug
-- that just became reserved would lock its owner out of saving. Stop here and
-- let a human decide instead.
do $$
declare
  v_conflicts text;
begin
  select string_agg(slug, ', ') into v_conflicts
  from public.sites
  where slug is not null and not public.is_valid_slug(slug);
  if v_conflicts is not null then
    raise exception 'Published slugs that are now reserved/invalid: %', v_conflicts;
  end if;
end;
$$;

-- ---- 3. Site content ----

create function public.is_valid_site_content(p_content jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(p_content) is distinct from 'array' then false
    when jsonb_array_length(p_content) > 10 then false
    when octet_length(p_content::text) > 25 * 1024 * 1024 then false
    else
      not exists (
        select 1
        from jsonb_array_elements(p_content) as item
        where jsonb_typeof(item) <> 'object'
           or jsonb_typeof(item -> 'instanceId') is distinct from 'string'
           or jsonb_typeof(item -> 'values') is distinct from 'object'
           or not coalesce(item ->> 'templateId' = any (array[
                'hero', 'photo-gallery', 'love-letter', 'flip-cards', 'carousel',
                'timeline', 'make-a-wish', 'final-message', 'name-display',
                'floating-decoration', 'surprises', 'love-playlist', 'promise-jar'
              ]), false)
      )
      and not exists (
        select 1
        from jsonb_array_elements(p_content) as item,
             jsonb_each(case when jsonb_typeof(item -> 'values') = 'object' then item -> 'values' else '{}' end) as v(key, value)
        where jsonb_typeof(v.value) <> 'string'
           or (v.key ~ '^(backgroundImage|photo[0-9]+|slide[0-9]+Image)$'
               and (v.value #>> '{}') !~ '^(data:image/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2})?$')
           or (v.key in ('color', 'accentColor', 'jarColor')
               and (v.value #>> '{}') !~* '^#[0-9a-f]{3}([0-9a-f]{3})?$')
      )
      and (
        select count(*)
        from jsonb_array_elements(p_content) as item,
             jsonb_each_text(case when jsonb_typeof(item -> 'values') = 'object' then item -> 'values' else '{}' end) as v(key, value)
        where v.key ~ '^(backgroundImage|photo[0-9]+|slide[0-9]+Image)$' and v.value <> ''
      ) <= 8 -- MAX_IMAGES
  end;
$$;

alter table public.sites
  add constraint sites_content_valid
    check (public.is_valid_site_content(content)) not valid,
  add constraint sites_published_content_valid
    check (published_content is null or public.is_valid_site_content(published_content)) not valid;

-- ---- 4. Publishing ----

-- Clients may only save their draft; owner_id defaults to auth.uid().
revoke insert, update on public.sites from authenticated;
grant insert (content, lang), update (content, lang) on public.sites to authenticated;

-- Makes the saved draft public at /<slug>. Unique violations (slug taken)
-- surface as 23505 like before.
create function public.publish_site(p_slug text)
returns table (id uuid, slug text, lang text, content jsonb, published_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_owner uuid := auth.uid();
  v_last timestamptz;
begin
  if v_owner is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  select s.published_at into v_last from public.sites s where s.owner_id = v_owner;
  if not found then
    raise exception 'No site to publish' using errcode = 'P0002';
  end if;
  if v_last > now() - interval '10 seconds' then
    raise log 'publish_site rate limited: owner=%', v_owner;
    raise exception 'Publishing too often, try again in a few seconds' using errcode = 'P0001';
  end if;

  return query
    update public.sites s
       set slug = p_slug,
           published_content = s.content,
           published_at = now()
     where s.owner_id = v_owner
    returning s.id, s.slug, s.lang, s.content, s.published_at;

  -- Visible in the Postgres logs; no email or content
  raise log 'publish_site: owner=% slug=%', v_owner, p_slug;
end;
$$;

revoke execute on function public.publish_site(text) from public, anon;
grant execute on function public.publish_site(text) to authenticated;
