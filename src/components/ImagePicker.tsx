"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 2;
const MAX_BYTES = 5 * 1024 * 1024;

export function ImagePicker({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const full = images.length >= MAX_IMAGES;

  async function addFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const room = MAX_IMAGES - images.length;
    if (room <= 0) return;
    const chosen = list.slice(0, room);

    for (const file of chosen) {
      if (file.size > MAX_BYTES) {
        setError("Each image must be under 5MB.");
        continue;
      }
    }
    const valid = chosen.filter((f) => f.size <= MAX_BYTES);
    if (!valid.length) return;

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of valid) {
        const { data_url } = await api.uploadImage(file, "post");
        uploaded.push(data_url);
      }
      onChange([...images, ...uploaded].slice(0, MAX_IMAGES));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative h-24 w-24 overflow-hidden hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-black/70 text-white transition hover:bg-heart"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex h-24 w-24 flex-col items-center justify-center gap-1 hairline text-faint transition duration-fast hover:border-accent hover:text-accent",
              dragging && "border-accent text-accent bg-accentSoft",
            )}
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={18} />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  Add
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="mt-2 font-mono text-2xs uppercase tracking-wider text-faint">
        {error ? (
          <span className="text-heart">{error}</span>
        ) : (
          `Up to ${MAX_IMAGES} images, 5MB each. Drag and drop supported.`
        )}
      </p>
    </div>
  );
}
