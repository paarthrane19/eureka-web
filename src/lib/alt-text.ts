/**
 * Alt text for a post's attached images.
 *
 * Posts carry no per-image caption, so the headline is the only description
 * available. That is still far better than an empty alt: these images are
 * content, not decoration, and they are what a crawler or screen reader has to
 * go on. The index is only added when there is more than one image, so the
 * common single-image case reads cleanly.
 */
export function altFor(headline: string, index: number, total: number): string {
  const subject = headline.trim() || "this discovery";
  return total > 1
    ? `Image ${index + 1} of ${total} illustrating: ${subject}`
    : `Image illustrating: ${subject}`;
}
