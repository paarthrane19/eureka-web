"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { categoryColor } from "@/lib/colors";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImagePicker } from "@/components/ImagePicker";

export default function ComposePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const create = useMutation({
    mutationFn: () =>
      api.createPost({
        headline: headline.trim(),
        body: body.trim(),
        category,
        source_url: sourceUrl.trim() || null,
        images,
      }),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      router.push(`/app/post/${post.id}`);
    },
  });

  const valid = headline.trim().length > 3 && body.trim().length > 10;

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-bg/80 hairline-b px-6 py-4 backdrop-blur-md">
        <Link
          href="/app"
          className="flex h-8 w-8 items-center justify-center hairline transition duration-fast hover:border-accent"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display text-xl font-bold tracking-tight">
          New discovery
        </h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) create.mutate();
        }}
        className="px-6 py-8"
      >
        <label className="mb-5 block">
          <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
            Headline
          </span>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="State the discovery in one line."
            className="w-full hairline bg-surface px-3 py-3 font-display text-xl font-bold tracking-tight text-text outline-none transition duration-fast placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-faint focus:border-accent"
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
            The explanation
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Explain it clearly. What's the evidence?"
            rows={6}
            className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] leading-relaxed text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
          />
        </label>

        <div className="mb-5">
          <span className="mb-2 block font-mono text-2xs uppercase tracking-widest text-faint">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider transition duration-fast",
                  category === c
                    ? "bg-accent text-accentText"
                    : "hairline text-muted hover:border-accent",
                )}
              >
                <span
                  style={{ width: 5, height: 5, backgroundColor: categoryColor(c) }}
                />
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <span className="mb-2 block font-mono text-2xs uppercase tracking-widest text-faint">
            Images (optional)
          </span>
          <ImagePicker images={images} onChange={setImages} />
        </div>

        <label className="mb-6 block">
          <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
            Source URL (optional)
          </span>
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://journal.example.org/article"
            className="h-[46px] w-full hairline bg-surface px-3 font-mono text-sm text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
          />
        </label>

        {create.isError && (
          <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
            {create.error instanceof Error
              ? create.error.message
              : "Could not publish."}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || create.isPending}
          className="inline-flex h-[48px] items-center bg-accent px-6 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
        >
          {create.isPending ? "Publishing…" : "Publish discovery"}
        </button>
      </form>
    </div>
  );
}
