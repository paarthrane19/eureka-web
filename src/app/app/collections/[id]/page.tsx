"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { CategoryTag } from "@/components/CategoryTag";
import { useCollection } from "@/lib/hooks";
import { categoryColor } from "@/lib/colors";

/**
 * A curated collection and its reading list. Every item links out to its
 * primary source, so the page is only rendered for collections that actually
 * have items behind them.
 */
export default function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading, isError } = useCollection(params.id);

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-bg/80 hairline-b px-4 py-4 backdrop-blur-md md:px-6">
        <Link
          href="/app/explore"
          className="flex h-8 w-8 items-center justify-center hairline transition duration-fast hover:border-accent"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="font-mono text-2xs uppercase tracking-widest text-faint">
          Collection
        </span>
      </header>

      <div className="px-4 py-6 md:px-6 md:py-8">
        {isLoading && (
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse bg-surfaceAlt" />
            <div className="h-4 w-1/2 animate-pulse bg-surfaceAlt" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse bg-surfaceAlt" />
            ))}
          </div>
        )}

        {isError && (
          <div className="py-16 text-center">
            <p className="font-sans text-[15px] text-muted">
              This collection could not be loaded.
            </p>
            <Link
              href="/app/explore"
              className="mt-5 inline-flex h-10 items-center hairline px-4 font-mono text-2xs uppercase tracking-wider text-muted transition duration-fast hover:border-accent"
            >
              Back to Explore
            </Link>
          </div>
        )}

        {data && (
          <>
            <div className="flex items-start gap-4">
              <span className="text-4xl leading-none">
                {data.collection.emoji}
              </span>
              <div className="min-w-0">
                <CategoryTag category={data.collection.category} />
                <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight">
                  {data.collection.title}
                </h1>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
                  {data.collection.subtitle}
                </p>
                <p
                  className="mt-3 font-mono text-2xs uppercase tracking-wider"
                  style={{
                    color:
                      data.collection.accent ||
                      categoryColor(data.collection.category),
                  }}
                >
                  {data.items.length}{" "}
                  {data.items.length === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {data.items.length === 0 && (
                <p className="hairline px-4 py-10 text-center font-sans text-[15px] text-muted">
                  Nothing in this collection yet.
                </p>
              )}

              {data.items.map((item, i) => {
                const body = (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-sm font-bold tabular-nums text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-lg font-bold leading-snug tracking-tight">
                          {item.title}
                        </h2>
                        <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
                          {item.body}
                        </p>
                        {item.source_url && (
                          <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-accentInk">
                            Read the source
                            <ExternalLink size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );

                // Items without a source aren't links — no dead click targets.
                return item.source_url ? (
                  <a
                    key={item.id}
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hairline p-5 transition duration-fast hover:border-accent"
                  >
                    {body}
                  </a>
                ) : (
                  <div key={item.id} className="hairline p-5">
                    {body}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
