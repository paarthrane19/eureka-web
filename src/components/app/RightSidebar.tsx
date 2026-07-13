"use client";

import { Check, Plus, Sparkles, Users } from "lucide-react";

import { categoryColor } from "@/lib/colors";
import {
  useCircles,
  useDaily,
  useFollowQuestion,
  useJoinCircle,
  useLeaveCircle,
  useQuestions,
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

// The Discover sections (daily discovery, follow questions, study circles).
// Rendered in the desktop RightSidebar and, on mobile, on the /app/discover tab.
export function RightSidebarContent() {
  const daily = useDaily();
  const questions = useQuestions();
  const circles = useCircles();
  const follow = useFollowQuestion();
  const join = useJoinCircle();
  const leave = useLeaveCircle();

  return (
    <>
      {/* Daily discovery */}
      <section>
        <SectionTitle>Daily discovery</SectionTitle>
        {daily.data ? (
          <div className="bg-surfaceAlt hairline p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <span className="font-mono text-2xs uppercase tracking-wider text-accent">
                {daily.data.category}
              </span>
            </div>
            <p className="font-display text-[15px] font-bold leading-snug tracking-tight text-text">
              {daily.data.title}
            </p>
            <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-muted line-clamp-4">
              {daily.data.body}
            </p>
          </div>
        ) : (
          <div className="h-24 animate-pulse bg-surfaceAlt" />
        )}
      </section>

      {/* Trending questions */}
      <section>
        <SectionTitle>Follow questions</SectionTitle>
        <div className="space-y-2">
          {questions.data?.slice(0, 4).map((q) => (
            <div
              key={q.id}
              className="flex items-start justify-between gap-3 hairline px-3 py-2.5"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: categoryColor(q.category),
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                    {q.follower_count} following
                  </span>
                </span>
                <span className="mt-1 block font-sans text-[13px] leading-snug text-text">
                  {q.text}
                </span>
              </span>
              <button
                onClick={() => follow.mutate(q.id)}
                aria-label={q.following ? "Unfollow" : "Follow"}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center transition duration-fast",
                  q.following
                    ? "bg-accent text-accentText"
                    : "hairline text-muted hover:border-accent",
                )}
              >
                {q.following ? <Check size={12} /> : <Plus size={12} />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Study circles */}
      <section>
        <SectionTitle>Study circles</SectionTitle>
        <div className="space-y-2">
          {circles.data?.slice(0, 3).map((c) => (
            <div key={c.id} className="hairline px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-sans text-[13px] font-medium text-text">
                  <Users size={13} className="text-muted" />
                  {c.name}
                </span>
                <button
                  onClick={() =>
                    c.joined ? leave.mutate(c.id) : join.mutate(c.id)
                  }
                  className={cn(
                    "h-6 px-2 font-mono text-[10px] uppercase tracking-wider transition duration-fast",
                    c.joined
                      ? "bg-accent text-accentText"
                      : "hairline text-muted hover:border-accent",
                  )}
                >
                  {c.joined ? "Joined" : "Join"}
                </button>
              </div>
              <p className="mt-1 font-mono text-2xs tracking-wider text-faint">
                {c.member_count}/{c.capacity} members
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
