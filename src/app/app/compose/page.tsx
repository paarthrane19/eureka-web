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
import { RequireAuth } from "@/components/RequireAuth";

export default function ComposePage() {
  return (
    <RequireAuth
      title="Sign in to post"
      message="Create a free account to share a discovery with Eureka."
    >
      <Compose />
    </RequireAuth>
  );
}

// Mirrors LEVEL_LIMITS in the backend's schemas.py — keep the two in step.
const LIMITS = { headline: 100, hook: 150, explanation: 400, deepDive: 800 };

function Compose() {
  const router = useRouter();
  const qc = useQueryClient();

  const [headline, setHeadline] = useState("");
  // The three depth levels a reader steps through with the arrows. The headline
  // sits above all of them, so it can't double as level 1 without rendering
  // twice — each level needs its own body.
  const [hook, setHook] = useState("");
  const [explanation, setExplanation] = useState("");
  const [deepDive, setDeepDive] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const create = useMutation({
    mutationFn: () =>
      api.createPost({
        headline: headline.trim(),
        // Seeded posts keep body == levels[0]; the API re-derives it, but we
        // send it too so older clients and the response shape stay consistent.
        body: hook.trim(),
        levels: [hook.trim(), explanation.trim(), deepDive.trim()],
        category,
        source_url: sourceUrl.trim() || null,
        images,
      }),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      router.push(`/app/post/${post.id}`);
    },
  });

  const levelTexts = [hook.trim(), explanation.trim(), deepDive.trim()];
  const allLevelsFilled = levelTexts.every((t) => t.length > 10);
  // The API rejects duplicate levels, so catch it here with a clearer message.
  const levelsAreDistinct = new Set(levelTexts).size === 3;
  const withinLimits =
    headline.length <= LIMITS.headline &&
    hook.length <= LIMITS.hook &&
    explanation.length <= LIMITS.explanation &&
    deepDive.length <= LIMITS.deepDive;
  const valid =
    headline.trim().length > 3 &&
    allLevelsFilled &&
    levelsAreDistinct &&
    withinLimits;

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-bg/80 hairline-b px-4 py-4 backdrop-blur-md md:px-6">
        <Link
          href="/app"
          className="flex h-9 w-9 items-center justify-center hairline transition duration-fast hover:border-accent md:h-8 md:w-8"
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
        className="px-4 py-6 md:px-6 md:py-8"
      >
        <label className="mb-5 block">
          <FieldLabel label="Headline" value={headline} limit={LIMITS.headline} />
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={LIMITS.headline}
            placeholder="State the discovery in one line."
            className="w-full hairline bg-surface px-3 py-3 font-display text-xl font-bold tracking-tight text-text outline-none transition duration-fast placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-faint focus:border-accent"
          />
          <FieldHelp>The hook, one compelling sentence.</FieldHelp>
        </label>

        {/* The three depth levels, in the order readers step through them. */}
        <LevelField
          level={1}
          label="The hook"
          value={hook}
          onChange={setHook}
          limit={LIMITS.hook}
          rows={4}
          placeholder="The short version, as it appears in the feed."
          help="The one-paragraph version readers see first."
        />

        <LevelField
          level={2}
          label="The explanation"
          value={explanation}
          onChange={setExplanation}
          limit={LIMITS.explanation}
          rows={6}
          placeholder="Explain it clearly. What's the evidence?"
          help="The accessible explanation."
        />

        <LevelField
          level={3}
          label="Deep dive"
          value={deepDive}
          onChange={setDeepDive}
          limit={LIMITS.deepDive}
          rows={8}
          placeholder="Go deeper. How does it actually work, and what's still open?"
          help="The full picture, mechanism, context, what's still unknown."
        />

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
                  "flex items-center gap-1.5 px-3 py-2 font-mono text-2xs uppercase tracking-wider transition duration-fast md:py-1.5",
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

        {/* Say why the button is disabled rather than leaving it dead. */}
        {!valid && (headline || hook || explanation || deepDive) && (
          <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-faint">
            {!levelsAreDistinct && allLevelsFilled
              ? "Each depth level must say something different."
              : "All three depth levels are required before publishing."}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || create.isPending}
          className="flex h-[48px] w-full items-center justify-center bg-accent px-6 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50 sm:inline-flex sm:w-auto sm:justify-start"
        >
          {create.isPending ? "Publishing…" : "Publish discovery"}
        </button>
      </form>
    </div>
  );
}

/** Field label with a live character counter that reddens as you hit the cap. */
function FieldLabel({
  label,
  value,
  limit,
  level,
}: {
  label: string;
  value: string;
  limit: number;
  level?: number;
}) {
  const over = value.length >= limit;
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="font-mono text-2xs uppercase tracking-widest text-faint">
        {level ? (
          <>
            <span className="text-accentInk">Level {level}</span>
            <span className="mx-1.5">·</span>
          </>
        ) : null}
        {label}
      </span>
      <span
        aria-live="polite"
        className={cn(
          "shrink-0 font-mono text-2xs tabular-nums tracking-wider",
          over ? "text-heart" : "text-faint",
        )}
      >
        {value.length}/{limit}
      </span>
    </span>
  );
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 block font-sans text-2xs leading-relaxed text-faint">
      {children}
    </span>
  );
}

/** One rung of the depth ladder: label, counter, textarea, helper text. */
function LevelField({
  level,
  label,
  value,
  onChange,
  limit,
  rows,
  placeholder,
  help,
}: {
  level: number;
  label: string;
  value: string;
  onChange: (v: string) => void;
  limit: number;
  rows: number;
  placeholder: string;
  help: string;
}) {
  return (
    <label className="mb-5 block">
      <FieldLabel label={label} value={value} limit={limit} level={level} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={limit}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] leading-relaxed text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
      />
      <FieldHelp>{help}</FieldHelp>
    </label>
  );
}
