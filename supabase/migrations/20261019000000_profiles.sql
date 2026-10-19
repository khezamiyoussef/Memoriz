-- Replaces the Mongo `users` collection. Email + password live in auth.users;
-- the display name lives in the existing public.profiles table (full_name),
-- populated from the sign-up metadata. The table, its RLS and its policies
-- already exist in this project, so this only adds the sign-up trigger.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(trim(new.raw_user_meta_data ->> 'name'), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
