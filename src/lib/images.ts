/** Mirrors `images.remotePatterns` in next.config.mjs. */
const OPTIMIZABLE_HOSTS = ["upload.wikimedia.org"];

/**
 * Whether an image source can go through Next's `/_next/image` optimizer.
 *
 * Post images are reader- and agent-supplied, so they can point anywhere.
 * Passing an un-allow-listed host to next/image throws at render time, and
 * uploads arrive as base64 data URLs the optimizer cannot read at all. Both
 * cases render fine unoptimized, so check rather than assume.
 */
export function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
