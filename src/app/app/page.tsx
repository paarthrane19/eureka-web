"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PostCard } from "@/components/PostCard";
import { ScanLine } from "@/components/ScanLine";
import { useFeed } from "@/lib/hooks";
import type { FeedKind } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = ["All", ...CATEGORIES];

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedKind>("for-you");
  const [category, setCategory] = useState("All");
  const { data: posts, isLoading, isError } = useFeed(feed, category);

  const [activeIndex, setActiveIndex] = useState(0);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setLevel = useCallback((id: string, level: number) => {
    setLevels((prev) => ({ ...prev, [id]: Math.max(0, level) }));
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [feed, category]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable
      )
        return;
      if (!posts || posts.length === 0) return;

      if (e.key === "j") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(posts.length - 1, i + 1));
      } else if (e.key === "k") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        const post = posts[activeIndex];
        if (!post) return;
        const max = (post.levels?.length || 1) - 1;
        const cur = levels[post.id] ?? 0;
        if (cur < max) setLevel(post.id, cur + 1);
      } else if (e.key === "ArrowLeft") {
        const post = posts[activeIndex];
        if (!post) return;
        const cur = levels[post.id] ?? 0;
        if (cur > 0) setLevel(post.id, cur - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [posts, activeIndex, levels, setLevel]);

  useEffect(() => {
    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-bg/80 hairline-b backdrop-blur-md">
        <div className="flex items-center justify-between px-4 pt-5 md:px-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Feed
          </h1>
          <div className="hidden items-center gap-3 font-mono text-2xs uppercase tracking-widest text-faint md:flex">
            <kbd className="hairline px-1.5 py-0.5">J</kbd>
            <kbd className="hairline px-1.5 py-0.5">K</kbd>
            <span>navigate ·</span>
            <kbd className="hairline px-1.5 py-0.5">←</kbd>
            <kbd className="hairline px-1.5 py-0.5">→</kbd>
            <span>depth</span>
          </div>
        </div>

        {/* Feed kind */}
        <div className="mt-4 flex gap-6 px-4 md:px-6">
          {(["for-you", "all"] as FeedKind[]).map((k) => (
            <button
              key={k}
              onClick={() => setFeed(k)}
              className={cn(
                "relative pb-3 font-mono text-xs uppercase tracking-widest transition duration-fast",
                feed === k ? "text-text" : "text-faint hover:text-muted",
              )}
            >
              {k === "for-you" ? "For you" : "All"}
              {feed === k && (
                <span className="absolute inset-x-0 bottom-0">
                  <ScanLine height={2} />
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scroll-thin px-4 py-3 hairline-b md:px-6 md:py-4">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "flex shrink-0 items-center px-3 py-2 font-mono text-2xs uppercase tracking-wider transition duration-fast md:py-1.5",
              category === c
                ? "bg-accent text-accentText"
                : "hairline text-muted hover:border-accent",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Feed */}
      {isLoading && (
        <div className="space-y-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="hairline-b px-4 py-5 md:px-6 md:py-6">
              <div className="h-40 animate-pulse bg-surfaceAlt" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="px-4 py-16 text-center font-mono text-sm text-muted md:px-6">
          Could not load the feed. Is the API running?
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="px-4 py-16 text-center font-mono text-sm text-muted md:px-6">
          Nothing here yet. Be the first to post.
        </div>
      )}

      {posts?.map((post, i) => (
        <div
          key={post.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
        >
          <PostCard
            post={post}
            level={Math.min(
              levels[post.id] ?? 0,
              (post.levels?.length || 1) - 1,
            )}
            onLevelChange={(l) => setLevel(post.id, l)}
            active={i === activeIndex}
            onActivate={() => setActiveIndex(i)}
          />
        </div>
      ))}
    </div>
  );
}
