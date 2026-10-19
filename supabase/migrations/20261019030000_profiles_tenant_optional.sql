-- profiles.tenant_id is left over from an earlier project and was NOT NULL with
-- no default. handle_new_user() doesn't set it (this app has no tenants), so
-- every sign-up failed with "Database error saving new user".

alter table public.profiles alter column tenant_id drop not null;
