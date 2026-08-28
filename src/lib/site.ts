export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://supasift.com";

export const SITE_NAME = "Supasift";

/** Trim to a meta-description-friendly length without cutting a word in half. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}
