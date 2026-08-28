"use client";

import { ArrowBigUp, Check, Flame, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CategoryTag } from "@/components/CategoryTag";
import { altFor } from "@/lib/alt-text";
import { useAuthPrompt } from "@/lib/auth-prompt";
import { useAuth } from "@/lib/auth";
import { categoryColor } from "@/lib/colors";
import { isOptimizable } from "@/lib/images";
import {
  useCollections,
  useDailyDiscovery,
  useFollowQuestion,
  useQuestions,
  useTrending,
} from "@/lib/hooks";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Explore. Every section is backed by a live endpoint and every element on the
 * page is either a link to a real destination or a control that performs a real
 * action — no decorative cards.
 */
export default function ExplorePage() {
  const { user } = useAuth();
  const { prompt } = useAuthPrompt();

  // The post-based discovery (top post of the last 24h) rather than the static
  // curated fact: it's genuinely current and it links to a real post page.
  const daily = useDailyDiscovery();
  const collections = useCollections();
  const questions = useQuestions();
  const trending = useTrending();
  const follow = useFollowQuestion();

  return (
    <div>
      <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-4 py-5 backdrop-blur-md md:px-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Explore
        </h1>
      </header>

      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* ---- Daily discovery ---- */}
        <section className="mb-10">
          <SectionTitle>Today&apos;s discovery</SectionTitle>
          {daily.isLoading ? (
            <div className="h-44 animate-pulse bg-surfaceAlt" />
          ) : daily.data ? (
            <Link
              href={`/app/post/${daily.data.id}`}
              className="group block hairline bg-surfaceAlt transition duration-fast hover:border-accent"
            >
              <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">
                {daily.data.images?.[0] && (
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-bg md:aspect-square md:w-40">
                    <Image
                      src={daily.data.images[0]}
                      alt={altFor(daily.data.headline, 0, 1)}
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      unoptimized={!isOptimizable(daily.data.images[0])}
                      className="object-cover transition duration-fast group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="shrink-0 text-accent" />
                    <CategoryTag category={daily.data.category} />
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-tight tracking-tight group-hover:text-accent">
                    {daily.data.headline}
                  </h2>
                  <p className="mt-2 max-w-2xl font-sans text-[15px] leading-relaxed text-muted line-clamp-3">
                    {daily.data.levels?.[0] || daily.data.body}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-faint">
                    <ArrowBigUp size={14} className="text-accent" />
                    {daily.data.upvotes} upvotes · {daily.data.comment_count}{" "}
                    responses
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <p className="hairline px-4 py-8 text-center font-sans text-[15px] text-muted">
              No standout discovery yet today. Check the feed for what&apos;s new.
            </p>
          )}
        </section>

        {/* ---- Categories ---- */}
        <section className="mb-10">
          <SectionTitle>Browse by field</SectionTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/app?category=${encodeURIComponent(c)}`}
                className="group flex items-center gap-2.5 hairline px-4 py-3 transition duration-fast hover:border-accent"
              >
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0"
                  style={{ backgroundColor: categoryColor(c) }}
                />
                <span className="truncate font-mono text-2xs uppercase tracking-wider text-muted group-hover:text-text">
                  {c}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- Collections ---- */}
        <section className="mb-10">
          <SectionTitle>Curated collections</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {collections.isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse bg-surfaceAlt" />
              ))}

            {collections.data?.map((c) => (
              <Link
                key={c.id}
                href={`/app/collections/${c.id}`}
                className="group hairline p-5 transition duration-fast hover:border-accent"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{c.emoji}</span>
                  <span
                    className="font-mono text-2xs uppercase tracking-wider"
                    style={{ color: c.accent || categoryColor(c.category) }}
                  >
                    {c.item_count} items
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight group-hover:text-accent">
                  {c.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted">{c.subtitle}</p>
              </Link>
            ))}
          </div>

          {collections.isError && <SectionError label="collections" />}
          {collections.data?.length === 0 && (
            <p className="hairline px-4 py-8 text-center font-sans text-[15px] text-muted">
              No collections published yet.
            </p>
          )}
        </section>

        {/* ---- Trending ---- */}
        <section className="mb-10">
          <SectionTitle>Trending this week</SectionTitle>
          <div className="space-y-1">
            {trending.isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-surfaceAlt" />
              ))}

            {trending.data?.map((p, i) => (
              <Link
                key={p.id}
                href={`/app/post/${p.id}`}
                className="group flex items-start gap-3 hairline-b px-1 py-3 transition duration-fast"
              >
                <span className="font-mono text-sm font-bold tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[15px] leading-snug text-text group-hover:text-accent">
                    {p.headline}
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-mono text-2xs tracking-wider text-faint">
                    <Flame size={11} className="text-accent" />
                    {p.upvotes} upvotes · {p.category}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {trending.isError && <SectionError label="trending posts" />}
          {trending.data?.length === 0 && (
            <p className="hairline px-4 py-8 text-center font-sans text-[15px] text-muted">
              Nothing trending yet this week.
            </p>
          )}
        </section>

        {/* ---- Open questions ---- */}
        <section>
          <SectionTitle>Open questions</SectionTitle>
          <div className="space-y-2">
            {questions.isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-surfaceAlt" />
              ))}

            {questions.data?.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between gap-4 hairline px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-sans text-[15px] text-text">{q.text}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <CategoryTag category={q.category} />
                    <span className="font-mono text-2xs tracking-wider text-faint">
                      · {q.follower_count} following · {q.answer_count} answers
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    user
                      ? follow.mutate(q.id)
                      : prompt({ message: "Sign in to follow questions." })
                  }
                  aria-pressed={q.following}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-1.5 px-3 font-mono text-2xs uppercase tracking-wider transition duration-fast",
                    q.following
                      ? "bg-accent text-accentText"
                      : "hairline text-muted hover:border-accent",
                  )}
                >
                  {q.following ? <Check size={12} /> : <Plus size={12} />}
                  {q.following ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          {questions.isError && <SectionError label="questions" />}
          {questions.data?.length === 0 && (
            <p className="hairline px-4 py-8 text-center font-sans text-[15px] text-muted">
              No open questions yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-2xs uppercase tracking-widest text-faint">
      {children}
    </h2>
  );
}

function SectionError({ label }: { label: string }) {
  return (
    <p className="hairline px-4 py-8 text-center font-mono text-2xs uppercase tracking-wider text-muted">
      Could not load {label}.
    </p>
  );
}
