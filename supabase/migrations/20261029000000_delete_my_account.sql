-- Lets a signed-in user delete their own account (GDPR Art. 17) from the
-- dashboard. Deleting the auth user cascades to public.sites, so the public
-- page goes offline at once. public.profiles predates these migrations and its
-- foreign key may not cascade, so its row is deleted explicitly.

create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  delete from public.sites where owner_id = v_user;
  delete from public.profiles where id = v_user;
  delete from auth.users where id = v_user;

  -- Visible in the Postgres logs; no email or content
  raise log 'delete_my_account: user=%', v_user;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
