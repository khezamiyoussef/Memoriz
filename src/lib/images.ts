// Uploaded pictures are stored in the site's JSON as data URLs. Re-encoding
// them through a canvas keeps them small, guarantees a plain raster format
// (never SVG or anything else the file claims to be) and drops EXIF metadata
// such as the GPS position where a photo was taken.

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_SIDE = 1920;
const QUALITY = 0.85;

export class InvalidImageError extends Error {}

export async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.size > MAX_FILE_BYTES) {
    throw new InvalidImageError("Not an image, or too large");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new InvalidImageError("Could not decode the image");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Browsers that can't encode WebP silently return PNG, which is far bigger for photos
  const webp = canvas.toDataURL("image/webp", QUALITY);
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", QUALITY);
}
