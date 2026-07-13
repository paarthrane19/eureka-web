"use client";

import { Sparkles } from "lucide-react";

import { CategoryTag } from "@/components/CategoryTag";
import { categoryColor } from "@/lib/colors";
import { useCollections, useDaily, useQuestions } from "@/lib/hooks";

export default function ExplorePage() {
  const daily = useDaily();
  const collections = useCollections();
  const questions = useQuestions();

  return (
    <div>
      <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-4 py-5 backdrop-blur-md md:px-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Explore
        </h1>
      </header>

      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* Daily discovery hero */}
        {daily.data && (
          <section className="mb-10 hairline bg-surfaceAlt p-5 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              <span className="font-mono text-2xs uppercase tracking-widest text-accent">
                Today&apos;s discovery · {daily.data.category}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">
              {daily.data.title}
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
              {daily.data.body}
            </p>
          </section>
        )}

        {/* Collections */}
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-2xs uppercase tracking-widest text-faint">
            Curated collections
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {collections.data?.map((c) => (
              <div
                key={c.id}
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
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted">
                  {c.subtitle}
                </p>
              </div>
            ))}
            {collections.isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse bg-surfaceAlt" />
              ))}
          </div>
        </section>

        {/* Questions */}
        <section>
          <h2 className="mb-4 font-mono text-2xs uppercase tracking-widest text-faint">
            Open questions
          </h2>
          <div className="space-y-2">
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
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
