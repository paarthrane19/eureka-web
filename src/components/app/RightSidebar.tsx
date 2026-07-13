"use client";

import { ArrowBigUp, Check, Flame, Plus, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { CategoryTag } from "@/components/CategoryTag";
import { categoryColor } from "@/lib/colors";
import {
  useCircles,
  useDailyDiscovery,
  useFollowQuestion,
  useJoinCircle,
  useLeaveCircle,
  useQuestions,
  useTrending,
} from "@/lib/hooks";
import { cn } from "@/lib/utils";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-mono text-2xs uppercase tracking-widest text-faint">
      {children}
    </h2>
  );
}

export function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 flex-col gap-8 overflow-y-auto scroll-thin hairline-l px-5 py-6 xl:flex">
      <RightSidebarContent />
    </aside>
  );
}

// The Discover sections (daily discovery, follow questions, study circles,
// trending). Rendered in the desktop RightSidebar and, on mobile, on the
// /app/discover tab.
export function RightSidebarContent() {
  const daily = useDailyDiscovery();
  const questions = useQuestions();
  const circles = useCircles();
  const trending = useTrending();
  const follow = useFollowQuestion();
  const join = useJoinCircle();
  const leave = useLeaveCircle();

  return (
    <>
      {/* Daily discovery — the top post of the last 24 hours */}
      <section>
        <SectionTitle>Daily discovery</SectionTitle>
        {daily.isLoading ? (
          <div className="h-40 animate-pulse bg-surfaceAlt" />
        ) : daily.data ? (
          <Link
            href={`/app/post/${daily.data.id}`}
            className="group block hairline transition duration-fast hover:border-accent"
          >
            {daily.data.images?.[0] && (
              <div className="aspect-[16/9] w-full overflow-hidden bg-surfaceAlt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={daily.data.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition duration-fast group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={13} className="shrink-0 text-accent" />
                <CategoryTag category={daily.data.category} />
              </div>
              <p className="font-display text-[15px] font-bold leading-snug tracking-tight text-text">
                {daily.data.headline}
              </p>
              <div className="mt-2 flex items-center gap-1 font-mono text-2xs tracking-wider text-faint">
                <ArrowBigUp size={13} className="text-accent" />
                {daily.data.upvotes} upvotes
              </div>
            </div>
          </Link>
        ) : (
          <p className="font-sans text-[13px] text-faint">
            No standout discovery yet today.
          </p>
        )}
      </section>

      {/* Follow questions — monospace pill badges */}
      <section>
        <SectionTitle>Follow questions</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {questions.data?.map((q) => (
            <button
              key={q.id}
              onClick={() => follow.mutate(q.id)}
              aria-pressed={q.following}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-tight transition duration-fast",
                q.following
                  ? "border-accent bg-accent text-accentText"
                  : "hairline text-muted hover:border-accent hover:text-text",
              )}
            >
              <span
                className="inline-block shrink-0 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: q.following
                    ? "currentColor"
                    : categoryColor(q.category),
                }}
              />
              {q.text}
              {q.following ? (
                <Check size={12} className="shrink-0" />
              ) : (
                <Plus size={12} className="shrink-0" />
              )}
            </button>
          ))}
          {questions.isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 w-40 animate-pulse rounded-full bg-surfaceAlt" />
            ))}
        </div>
      </section>

      {/* Study circles */}
      <section>
        <SectionTitle>Study circles</SectionTitle>
        <div className="space-y-2">
          {circles.data?.map((c) => (
            <div key={c.id} className="hairline px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 font-sans text-[13px] font-medium text-text">
                  <Users size={13} className="shrink-0 text-muted" />
                  <span className="truncate">{c.name}</span>
                </span>
                <button
                  onClick={() =>
                    c.joined ? leave.mutate(c.id) : join.mutate(c.id)
                  }
                  className={cn(
                    "h-6 shrink-0 px-2 font-mono text-[10px] uppercase tracking-wider transition duration-fast",
                    c.joined
                      ? "bg-accent text-accentText"
                      : "hairline text-muted hover:border-accent",
                  )}
                >
                  {c.joined ? "Joined" : "Join"}
                </button>
              </div>
              <p className="mt-1 font-mono text-2xs tracking-wider text-faint">
                {c.member_count} members
              </p>
            </div>
          ))}
          {circles.isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-surfaceAlt" />
            ))}
        </div>
      </section>

      {/* Trending — top posts of the last 7 days */}
      <section>
        <SectionTitle>Trending</SectionTitle>
        <div className="space-y-1">
          {trending.data?.map((p, i) => (
            <Link
              key={p.id}
              href={`/app/post/${p.id}`}
              className="group flex items-start gap-3 px-1 py-2 transition duration-fast"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-faint">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[13px] leading-snug text-text line-clamp-2 group-hover:text-accent">
                  {p.headline}
                </span>
                <span className="mt-1 flex items-center gap-1 font-mono text-2xs tracking-wider text-faint">
                  <Flame size={11} className="text-accent" />
                  {p.upvotes} upvotes
                </span>
              </span>
            </Link>
          ))}
          {trending.isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse bg-surfaceAlt" />
            ))}
        </div>
      </section>
    </>
  );
}
