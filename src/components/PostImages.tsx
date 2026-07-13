"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Lightbox } from "./Lightbox";

export function PostImages({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (!images?.length) return null;

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
          images.length === 2 ? "grid-cols-2" : "grid-cols-1",
          className,
        )}
      >
        {images.slice(0, 2).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => open(i, e)}
            className="group relative block overflow-hidden bg-surfaceAlt"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className={cn(
                "block w-full object-cover transition duration-medium group-hover:brightness-95",
                images.length === 2
                  ? "aspect-square"
                  : "max-h-[70vh] md:max-h-[420px]",
              )}
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
