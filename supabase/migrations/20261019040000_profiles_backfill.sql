-- One-off: create profiles for accounts that existed before the
-- on_auth_user_created trigger (e.g. accounts from the earlier project).
-- Safe to re-run: existing profiles are left untouched.

insert into public.profiles (id, email, full_name)
select id,
       email,
       coalesce(raw_user_meta_data ->> 'name',
                raw_user_meta_data ->> 'full_name',
                raw_user_meta_data ->> 'display_name',
                '')
from auth.users
on conflict (id) do nothing;
