import { supabase } from "@/lib/supabase";
import type { CanvasItem } from "@/types/builder";
import type { Lang } from "@/i18n/translations";

export type MySite = {
  id: string;
  slug: string | null;
  lang: Lang;
  content: CanvasItem[];
  published_at: string | null;
};

export type SlugStatus = "available" | "yours" | "taken" | "reserved" | "invalid";

export type PublishedSite = {
  slug: string;
  lang: Lang;
  content: CanvasItem[];
};

// Mirrors public.is_valid_slug() in the database, for instant feedback while typing.
export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

export function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // é → e
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 40);
}

export function isWellFormedSlug(slug: string) {
  return SLUG_PATTERN.test(slug) && !slug.includes("--");
}

// Where published sites live, e.g. https://xxxx.xx — defaults to wherever the app runs.
export function publicSiteBase() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  const base = configured || window.location.origin + import.meta.env.BASE_URL;
  return base.replace(/\/+$/, "");
}

export function publicSiteUrl(slug: string) {
  return `${publicSiteBase()}/${slug}`;
}

export async function getMySite(): Promise<MySite | null> {
  const { data, error } = await supabase
    .from("sites")
    .select("id, slug, lang, content, published_at")
    .maybeSingle();
  if (error) throw error;
  return data as MySite | null;
}

export async function saveDraft(content: CanvasItem[], lang: Lang): Promise<MySite> {
  const { data, error } = await supabase
    .from("sites")
    .upsert({ content, lang }, { onConflict: "owner_id" })
    .select("id, slug, lang, content, published_at")
    .single();
  if (error) throw error;
  return data as MySite;
}

export async function checkSlug(slug: string): Promise<SlugStatus> {
  const { data, error } = await supabase.rpc("check_slug", { p_slug: slug });
  if (error) throw error;
  return data as SlugStatus;
}

export class SlugTakenError extends Error {}

// Saves the current canvas and makes it the public version at /<slug>.
export async function publishSite(slug: string, content: CanvasItem[], lang: Lang): Promise<MySite> {
  const { data, error } = await supabase
    .from("sites")
    .upsert(
      {
        slug,
        lang,
        content,
        published_content: content,
        published_at: new Date().toISOString(),
      },
      { onConflict: "owner_id" }
    )
    .select("id, slug, lang, content, published_at")
    .single();
  if (error) {
    // unique_violation on slug: someone claimed it between the check and the publish
    if (error.code === "23505") throw new SlugTakenError(error.message);
    throw error;
  }
  return data as MySite;
}

export async function getPublishedSite(slug: string): Promise<PublishedSite | null> {
  const { data, error } = await supabase.rpc("get_published_site", { p_slug: slug }).maybeSingle();
  if (error) throw error;
  return data as PublishedSite | null;
}
