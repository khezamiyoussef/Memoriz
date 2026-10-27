-- sites_published_content_valid was added NOT VALID, but Postgres still
-- rechecks it on every update of a row. A site published before the hardening
-- migration kept a snapshot that fails the new rules, so its owner could no
-- longer save their draft. Check the snapshot only when it is written instead:
-- publish_site() replaces it with the validated draft.

alter table public.sites drop constraint sites_published_content_valid;

create function public.check_published_content()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.published_content is not null
     and (tg_op = 'INSERT' or new.published_content is distinct from old.published_content)
     and not public.is_valid_site_content(new.published_content) then
    raise exception 'Invalid published content'
      using errcode = '23514', constraint = 'sites_published_content_valid';
  end if;
  return new;
end;
$$;

create trigger sites_published_content_valid
  before insert or update of published_content on public.sites
  for each row execute function public.check_published_content();
