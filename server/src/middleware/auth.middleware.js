import { createClient } from "@supabase/supabase-js";
import { logEvent } from "../logger.js";

let supabase;
const getSupabase = () =>
  (supabase ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  }));

// Accepts a Supabase access token (the dashboard's session) as a Bearer token.
export async function requireUser(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (!token) {
    logEvent("auth_failed", { route: req.path, reason: "missing_token" });
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await getSupabase().auth.getUser(token);
  if (error || !data.user) {
    logEvent("auth_failed", { route: req.path, reason: "invalid_token" });
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = data.user.id;
  next();
}
