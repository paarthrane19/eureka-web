"use client";

import { ArrowLeft, Lock, Send, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { CategoryTag } from "@/components/CategoryTag";
import { useAuthPrompt } from "@/lib/auth-prompt";
import { useAuth } from "@/lib/auth";
import {
  useCircle,
  useCircleMembership,
  useCircleMessages,
  useSendCircleMessage,
} from "@/lib/hooks";
import { relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export default function CirclePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();
  const { prompt } = useAuthPrompt();

  const circle = useCircle(id);
  const messages = useCircleMessages(id);
  const { join, leave } = useCircleMembership(id);
  const send = useSendCircleMessage(id);

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // Unlike chat, this discussion sits in the normal document flow, so scrolling
  // it moves the whole page. Auto-scrolling on load would bury the circle's
  // title and roster, and doing it on every poll would yank the page out from
  // under someone mid-read — so we only jump after *this* user posts.
  const scrollAfterSend = useRef(false);

  const joined = circle.data?.joined ?? false;
  const messageCount = messages.data?.length ?? 0;

  useEffect(() => {
    if (!scrollAfterSend.current) return;
    scrollAfterSend.current = false;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messageCount]);

  // ---- Loading ----
  if (circle.isLoading) {
    return (
      <div>
        <CircleHeader />
        <div className="space-y-4 px-4 py-8 md:px-6">
          <div className="h-8 w-2/3 animate-pulse bg-surfaceAlt" />
          <div className="h-24 animate-pulse bg-surfaceAlt" />
          <div className="h-40 animate-pulse bg-surfaceAlt" />
        </div>
      </div>
    );
  }

  // ---- Error / not found ----
  if (circle.isError || !circle.data) {
    return (
      <div>
        <CircleHeader />
        <div className="px-4 py-16 text-center md:px-6">
          <p className="font-sans text-[15px] text-muted">
            This circle could not be loaded. It may have been removed.
          </p>
          <Link
            href="/app/discover"
            className="mt-5 inline-flex h-10 items-center hairline px-4 font-mono text-2xs uppercase tracking-wider text-muted transition duration-fast hover:border-accent"
          >
            Browse all circles
          </Link>
        </div>
      </div>
    );
  }

  const c = circle.data;
  const full = c.member_count >= c.capacity && !joined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      prompt({ message: "Sign in to join this circle's discussion." });
      return;
    }
    if (!joined || !draft.trim()) return;
    send.mutate(draft.trim(), {
      onSuccess: () => {
        setDraft("");
        scrollAfterSend.current = true;
      },
    });
  };

  const toggleMembership = () => {
    if (!user) {
      prompt({ message: "Sign in to join study circles." });
      return;
    }
    if (joined) leave.mutate();
    else join.mutate();
  };

  const busy = join.isPending || leave.isPending;

  return (
    <div>
      <CircleHeader />

      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* ---- Circle identity ---- */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CategoryTag category={c.category} />
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight">
              {c.name}
            </h1>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
              {c.topic}
            </p>
          </div>
          <button
            onClick={toggleMembership}
            disabled={busy || full}
            className={cn(
              "h-10 shrink-0 px-4 font-mono text-2xs font-bold uppercase tracking-wider transition duration-fast disabled:opacity-50",
              joined
                ? "hairline text-muted hover:border-accent"
                : "bg-accent text-accentText hover:brightness-105",
            )}
          >
            {busy ? "…" : joined ? "Leave" : full ? "Full" : "Join"}
          </button>
        </div>

        {c.description && (
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-text">
            {c.description}
          </p>
        )}

        {/* ---- Members ---- */}
        <section className="mt-6 hairline bg-surfaceAlt p-5">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-muted" />
            <span className="font-mono text-2xs uppercase tracking-widest text-faint">
              {c.member_count} of {c.capacity} members
            </span>
          </div>
          {c.members.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {c.members.map((m) => (
                <Link
                  key={m.id}
                  href={`/profile/${m.username}`}
                  className="group flex items-center gap-2"
                >
                  <Avatar
                    name={m.name}
                    color={m.avatar_color}
                    src={m.avatar_url}
                    size={28}
                  />
                  <span className="font-sans text-sm text-muted transition duration-fast group-hover:text-accent">
                    {m.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-sans text-sm text-faint">
              No members yet. Be the first to join.
            </p>
          )}
        </section>

        {/* ---- Discussion ---- */}
        <section className="mt-8">
          <h2 className="mb-4 font-mono text-2xs uppercase tracking-widest text-faint">
            Discussion
          </h2>

          {messages.isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-surfaceAlt" />
              ))}
            </div>
          )}

          {messages.isError && (
            <p className="hairline px-4 py-6 text-center font-mono text-2xs uppercase tracking-wider text-muted">
              Could not load the discussion.
            </p>
          )}

          {messages.data && messages.data.length === 0 && (
            <div className="hairline px-4 py-10 text-center">
              <p className="font-sans text-[15px] text-muted">
                No messages yet.
              </p>
              <p className="mt-1 font-mono text-2xs uppercase tracking-wider text-faint">
                {joined
                  ? "Start the conversation."
                  : "Join the circle to start the conversation."}
              </p>
            </div>
          )}

          <div className="space-y-5">
            {messages.data?.map((m) => (
              <div key={m.id} className="flex gap-3">
                <Avatar
                  name={m.author.name}
                  color={m.author.avatar_color}
                  src={m.author.avatar_url}
                  size={30}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${m.author.username}`}
                      className="font-sans text-sm font-medium text-text transition duration-fast hover:text-accent"
                    >
                      {m.author.name}
                    </Link>
                    <span className="font-mono text-2xs text-faint">
                      {relativeTime(m.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[15px] leading-relaxed text-muted">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* ---- Composer / join gate ---- */}
          <div className="mt-6">
            {joined ? (
              <form onSubmit={submit}>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Share something with the circle…"
                  aria-label={`Message ${c.name}`}
                  rows={3}
                  className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
                />
                {send.isError && (
                  <p className="mt-2 font-mono text-2xs uppercase tracking-wide text-heart">
                    Could not post that. Try again.
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!draft.trim() || send.isPending}
                    className="flex h-9 items-center gap-2 bg-accent px-4 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
                  >
                    <Send size={14} />
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center hairline bg-surfaceAlt px-4 py-8 text-center">
                <span className="mb-3 flex h-10 w-10 items-center justify-center hairline">
                  <Lock size={16} className="text-accent" />
                </span>
                <p className="font-sans text-[15px] text-text">
                  {full
                    ? "This circle is full."
                    : "Join this circle to post in the discussion."}
                </p>
                <p className="mt-1 font-sans text-sm text-muted">
                  You can keep reading either way.
                </p>
                {!full && (
                  <button
                    onClick={toggleMembership}
                    disabled={busy}
                    className="mt-4 h-10 bg-accent px-5 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
                  >
                    {busy ? "Joining…" : "Join circle"}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function CircleHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-bg/80 hairline-b px-4 py-4 backdrop-blur-md md:px-6">
      <Link
        href="/app/discover"
        className="flex h-8 w-8 items-center justify-center hairline transition duration-fast hover:border-accent"
      >
        <ArrowLeft size={16} />
      </Link>
      <span className="font-mono text-2xs uppercase tracking-widest text-faint">
        Study circle
      </span>
    </header>
  );
}
