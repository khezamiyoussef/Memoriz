import type { CanvasItem, FieldDef } from "@/types/builder";
import { getTemplate, MAX_IMAGES } from "@/data/templates";
import { parseYouTubeId } from "@/lib/youtube";

// A site's JSON is untrusted: owners can write any JSON to their row in
// `sites`, not just what the editor produces, and published pages run on the
// same origin as the dashboard. Everything loaded from or saved to the
// database goes through sanitizeContent(); the database checks the same
// rules again (public.is_valid_site_content).

export const MAX_ITEMS = 10;
const MAX_TEXT = 500;
const MAX_TEXTAREA = 5000;
const MAX_LINK = 300;

// Uploads are re-encoded by prepareImage(), so only raster data URLs are valid
// (no remote URLs, no SVG).
const IMAGE_DATA_URL = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
const HEX_COLOR = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;
const INSTANCE_ID = /^[\w-]{1,100}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function sanitizeValue(field: FieldDef, value: string): string {
  switch (field.type) {
    case "image":
      return IMAGE_DATA_URL.test(value) ? value : "";
    case "color":
      return HEX_COLOR.test(value) ? value : field.defaultValue;
    case "number": {
      const num = parseInt(value, 10);
      if (isNaN(num)) return field.defaultValue;
      return String(Math.min(field.max ?? 9999, Math.max(field.min ?? 0, num)));
    }
    case "youtube":
      return value.length <= MAX_LINK && parseYouTubeId(value) ? value.trim() : "";
    case "textarea":
      return value.slice(0, MAX_TEXTAREA);
    default:
      return value.slice(0, MAX_TEXT);
  }
}

/** Keeps only known templates and fields, with values each field type allows. */
export function sanitizeContent(input: unknown): CanvasItem[] {
  if (!Array.isArray(input)) return [];

  const items: CanvasItem[] = [];
  const seenIds = new Set<string>();
  let images = 0;

  for (const raw of input.slice(0, MAX_ITEMS)) {
    if (!isRecord(raw) || typeof raw.templateId !== "string") continue;
    const template = getTemplate(raw.templateId);
    if (!template) continue;

    let instanceId = typeof raw.instanceId === "string" && INSTANCE_ID.test(raw.instanceId) ? raw.instanceId : "";
    if (!instanceId || seenIds.has(instanceId)) instanceId = `${template.id}-${items.length}-${seenIds.size}`;
    seenIds.add(instanceId);

    const rawValues = isRecord(raw.values) ? raw.values : {};
    const values: Record<string, string> = {};
    for (const field of template.fields) {
      const value = rawValues[field.id];
      if (typeof value === "string") {
        const clean = sanitizeValue(field, value);
        if (field.type === "image" && clean) {
          if (images >= MAX_IMAGES) continue;
          images++;
        }
        values[field.id] = clean;
      }
      // YouTubeField remembers the search behind an automatic link as `<id>Query`
      const query = rawValues[`${field.id}Query`];
      if (field.type === "youtube" && typeof query === "string") {
        values[`${field.id}Query`] = query.slice(0, MAX_TEXT);
      }
    }

    items.push({ instanceId, templateId: template.id, values });
  }
  return items;
}
