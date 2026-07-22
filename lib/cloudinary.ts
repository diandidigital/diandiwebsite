const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const cloudinaryConfigured = Boolean(CLOUD_NAME);

/**
 * Le champ admin accepte soit un public_id nu ("dossier/image"), soit une
 * URL de livraison Cloudinary complète copiée depuis la médiathèque
 * ("https://res.cloudinary.com/<cloud>/image/upload/v169.../dossier/image.jpg").
 * On extrait le public_id dans ce second cas pour éviter d'imbriquer une URL
 * dans une autre.
 */
function extractPublicId(value: string): string {
  const marker = "/image/upload/";
  const idx = value.indexOf(marker);
  if (idx === -1) return value;

  const segments = value.slice(idx + marker.length).split("/");
  while (segments.length && /^v\d+$/.test(segments[0])) {
    segments.shift();
  }
  return segments.join("/");
}

/**
 * Builds a delivery URL for a Cloudinary asset by public ID.
 * Returns null when no cloud name is configured yet, so callers can
 * fall back to a local placeholder until credentials are provided.
 */
export function cloudinaryUrl(
  publicId: string,
  { width, height }: { width?: number; height?: number } = {}
): string | null {
  if (!CLOUD_NAME) return null;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width && height) transforms.push("c_fill");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(",")}/${extractPublicId(publicId)}`;
}

/**
 * Builds a Cloudinary "fetch" delivery URL: Cloudinary downloads, optimizes
 * and caches a remote image (e.g. still hosted on the old WordPress site)
 * on the fly, without needing to upload it manually first.
 */
export function cloudinaryFetchUrl(
  remoteUrl: string,
  { width, height }: { width?: number; height?: number } = {}
): string | null {
  if (!CLOUD_NAME) return null;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width && height) transforms.push("c_fill");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transforms.join(",")}/${encodeURIComponent(remoteUrl)}`;
}
