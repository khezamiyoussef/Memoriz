import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Dictionary } from "@/i18n/translations";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser({ name, email, password }: RegisterPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      // Proof of the age confirmation and Terms acceptance from the sign-up form
      data: { name: name.trim(), accepted_terms_at: new Date().toISOString() },
      // Back to the site the user signed up on (must be listed in Supabase's Redirect URLs)
      emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}language`,
    },
  });
  if (error) throw error;
  return data;
}

export async function loginUser({ email, password }: LoginPayload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function resendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}language` },
  });
  if (error) throw error;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function authErrorMessage(err: unknown, t: Dictionary): string {
  if (err instanceof AuthError) {
    return (err.code && t.auth.errors[err.code]) || err.message;
  }
  return err instanceof Error ? err.message : t.auth.genericError;
}

// ---- GDPR: export (Art. 15/20) and erasure (Art. 17) ----

/** Everything stored about the signed-in user, as a JSON file download. */
export async function downloadMyData() {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw authError ?? new Error("Not signed in");
  const user = auth.user;

  const [profile, site] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle(),
    supabase
      .from("sites")
      .select("slug, lang, content, published_content, published_at, created_at, updated_at")
      .maybeSingle(),
  ]);
  if (profile.error) throw profile.error;
  if (site.error) throw site.error;

  const exported = {
    exported_at: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      metadata: user.user_metadata,
    },
    profile: profile.data,
    site: site.data,
  };

  const url = URL.createObjectURL(new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "memoriz-my-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

/** Deletes the account, its site and public page for good, then signs out. */
export async function deleteMyAccount() {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
  // The user no longer exists; only clear the local session
  await supabase.auth.signOut({ scope: "local" });
}
