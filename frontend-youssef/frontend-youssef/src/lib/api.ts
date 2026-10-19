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
    options: { data: { name: name.trim() } },
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
