"use client";

import { Bookmark, ChevronLeft, ChevronRight, MessageSquare, ChevronUp, Pin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useBookmark, useUpvote } from "@/lib/hooks";
import { relativeTime } from "@/lib/time";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Avatar } from "./Avatar";
import { CategoryTag } from "./CategoryTag";
import { CredibilityDots } from "./CredibilityIndicator";
import { DepthDots, LEVEL_LABELS } from "./DepthDots";
import { PostImages } from "./PostImages";
import { VerifiedBadge } from "./VerifiedBadge";

export function PostCard({
  post,
  level,
  onLevelChange,
  active,
  onActivate,
}: {
  post: Post;
  level: number;
  onLevelChange: (level: number) => void;
  active?: boolean;
  onActivate?: () => void;
}) {
  const router = useRouter();
  const upvote = useUpvote();
  const bookmark = useBookmark();

  const levels = post.levels?.length ? post.levels : [post.body];
  const clamped = Math.min(level, levels.length - 1);
  const canPrev = clamped > 0;
  const canNext = clamped < levels.length - 1;

  // Direction of the last level change, so the content slides in the right way.
  const prevLevel = useRef(clamped);
  const goingDeeper = clamped >= prevLevel.current;
  prevLevel.current = clamped;

  return (
    <article
      onMouseEnter={onActivate}
      className={cn(
        "relative px-4 py-5 hairline-b transition-colors duration-fast md:px-6 md:py-6",
        active ? "bg-surfaceAlt" : "bg-surface",
      )}
    >
      {active && <div className="absolute left-0 top-0 h-full w-[2px] bg-accent" />}

      {post.pinned && (
        <div className="mb-2 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-widest text-faint">
          <Pin size={11} className="text-accent" /> Pinned
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <CategoryTag category={post.category} />
        <CredibilityDots score={post.credibility?.score ?? 0} cells={8} />
      </div>

      <Link href={`/app/post/${post.id}`}>
        <h2 className="font-display text-xl font-bold leading-tight tracking-tight hover:text-accent md:text-2xl">
          {post.headline}
        </h2>
      </Link>

      <div className="mt-3 min-h-[4.5rem]">
        <p
          key={clamped}
          className={cn(
            "font-sans text-[15px] leading-relaxed text-muted",
            goingDeeper ? "animate-depth-next" : "animate-depth-prev",
          )}
        >
          {levels[clamped]}
        </p>
      </div>

      {post.images?.length > 0 && <PostImages images={post.images} />}

      {/* Depth navigation */}
      <div className="mt-4 flex items-center justify-between">
        <DepthDots
          count={levels.length}
          active={clamped}
          onSelect={onLevelChange}
        />
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous level"
            disabled={!canPrev}
            onClick={() => canPrev && onLevelChange(clamped - 1)}
            className="flex h-9 w-9 items-center justify-center hairline transition duration-fast enabled:hover:border-accent disabled:opacity-30 md:h-8 md:w-8"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="w-24 text-center font-mono text-2xs uppercase tracking-widest text-faint">
            {LEVEL_LABELS[clamped]}
          </span>
          <button
            aria-label="Deeper level"
            disabled={!canNext}
            onClick={() => canNext && onLevelChange(clamped + 1)}
            className="flex h-9 w-9 items-center justify-center hairline transition duration-fast enabled:hover:border-accent disabled:opacity-30 md:h-8 md:w-8"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Meta + actions */}
      <div className="mt-5 flex items-center justify-between">
        <Link
          href={`/profile/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="group flex items-center gap-2"
        >
          <Avatar
            name={post.author.name}
            color={post.author.avatar_color}
            src={post.author.avatar_url}
            size={24}
          />
          <span className="flex items-center gap-1 font-mono text-2xs uppercase tracking-wider text-faint transition group-hover:text-muted">
            {post.author.name}
            {post.author.verified && <VerifiedBadge size={12} />}
            <span className="text-faint">· {relativeTime(post.created_at)}</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => upvote.mutate(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 transition duration-fast hover:text-accent",
              post.upvoted ? "text-accent" : "text-muted",
            )}
          >
            <ChevronUp size={18} />
            <span className="font-mono text-xs tabular-nums">{post.upvotes}</span>
          </button>
          <button
            onClick={() => router.push(`/app/post/${post.id}`)}
            className="flex items-center gap-1.5 px-2 py-1 text-muted transition duration-fast hover:text-accent"
          >
            <MessageSquare size={16} />
            <span className="font-mono text-xs tabular-nums">
              {post.comment_count}
            </span>
          </button>
          <button
            onClick={() => bookmark.mutate(post.id)}
            className={cn(
              "flex items-center px-2 py-1 transition duration-fast hover:text-accent",
              post.bookmarked ? "text-accent" : "text-muted",
            )}
          >
            <Bookmark size={16} fill={post.bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
