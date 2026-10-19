-- The profiles policies limit users to their own row, but not to specific
-- columns: a signed-in user could set their own role/balance/tenant_id from the
-- browser. Restrict what clients may write to the display name only.
--
-- Rows are created by the handle_new_user() trigger (security definer), so
-- clients never need to insert; the trigger is unaffected by these grants.

revoke insert, update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;

drop policy if exists "allow insert own profile" on public.profiles;
