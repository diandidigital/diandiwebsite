const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const cloudinaryConfigured = Boolean(CLOUD_NAME);

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
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`;
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
