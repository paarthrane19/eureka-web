"use client";

import Image from "next/image";
import { useState } from "react";

import { altFor } from "@/lib/alt-text";
import { isOptimizable } from "@/lib/images";
import { cn } from "@/lib/utils";

import { Lightbox } from "./Lightbox";

// The content column tops out at ~720px; a pair sits in two columns within it.
const SINGLE_SIZES = "(max-width: 768px) 100vw, 720px";
const PAIR_SIZES = "(max-width: 768px) 50vw, 360px";

export function PostImages({
  images,
  headline,
  className,
}: {
  images: string[];
  /** Post headline — the only description we have for reader-supplied images. */
  headline: string;
  className?: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (!images?.length) return null;

  const pair = images.length === 2;

  const open = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightbox(i);
  };

  return (
    <>
      <div
        className={cn(
          "mt-4 grid gap-1.5 overflow-hidden rounded-lg hairline",
          pair ? "grid-cols-2" : "grid-cols-1",
          className,
        )}
      >
        {images.slice(0, 2).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => open(i, e)}
            // The frame is fixed so its height is known before the image
            // arrives; without it the card reflows on every image load.
            className={cn(
              "group relative block w-full overflow-hidden bg-surfaceAlt",
              pair ? "aspect-square" : "aspect-video",
            )}
          >
            <Image
              src={src}
              alt={altFor(headline, i, images.length)}
              fill
              sizes={pair ? PAIR_SIZES : SINGLE_SIZES}
              unoptimized={!isOptimizable(src)}
              className="object-cover transition duration-medium group-hover:brightness-95"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          headline={headline}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
