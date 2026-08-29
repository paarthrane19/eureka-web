/** Schemes we are willing to put in an `href`. */
const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

/** Matches any leading URL scheme, e.g. "https:", "mailto:", "javascript:". */
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Normalise a stored link into something safe to render as an external `href`.
 *
 * Two problems this solves:
 *
 * 1. Protocol-less values. `source_url` has historically been written as
 *    "cam.ac.uk/research/news/..." with no scheme. A browser resolves that as a
 *    *relative path*, so the link silently becomes
 *    supasift.com/app/post/cam.ac.uk/... and 404s. Prepending https:// makes it
 *    the external link it was always meant to be.
 * 2. Unsafe schemes. `source_url` is reader-supplied through compose and lands
 *    directly in an href, so `javascript:` / `data:` values are a stored-XSS
 *    vector. Anything that isn't http(s) is rejected outright.
 *
 * Returns `null` when there is nothing safe to link to, so callers can skip
 * rendering the anchor rather than emitting a dead or dangerous click target.
 */
export function externalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let candidate: string;
  if (trimmed.startsWith("//")) {
    // Protocol-relative. Valid, but pin it to https rather than inheriting.
    candidate = `https:${trimmed}`;
  } else if (HAS_SCHEME.test(trimmed)) {
    // Already carries a scheme — keep it so it can be vetted below.
    candidate = trimmed;
  } else {
    candidate = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(candidate);
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** The bare domain + path, for showing a link without the noisy scheme. */
export function displayUrl(raw: string): string {
  return raw.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
