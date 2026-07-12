"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function Lightbox({
  images,
  startIndex = 0,
  onClose,
}: {
  images: string[];
  startIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const many = images.length > 1;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 animate-fade-up"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition hover:border-accent hover:text-accent"
      >
        <X size={18} />
      </button>

      {many && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          className="absolute left-5 flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition hover:border-accent hover:text-accent"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full object-contain"
      />

      {many && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          className="absolute right-5 flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition hover:border-accent hover:text-accent"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {many && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-2xs uppercase tracking-widest text-white/60">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
