"use client";

import {
  ArrowLeft,
  Bookmark,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { CategoryTag } from "@/components/CategoryTag";
import { CredibilityArc } from "@/components/CredibilityIndicator";
import { DepthDots, LEVEL_LABELS } from "@/components/DepthDots";
import { SourceBadge } from "@/components/SourceBadge";
import {
  useAddComment,
  useBookmark,
  useComments,
  usePost,
  useUpvote,
} from "@/lib/hooks";
import { relativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export default function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: post, isLoading } = usePost(id);
  const comments = useComments(id);
  const addComment = useAddComment(id);
  const upvote = useUpvote();
  const bookmark = useBookmark();

  const [level, setLevel] = useState(0);
  const [draft, setDraft] = useState("");

  if (isLoading || !post) {
    return (
      <div className="px-6 py-10">
        <div className="h-64 animate-pulse bg-surfaceAlt" />
      </div>
    );
  }

  const levels = post.levels?.length ? post.levels : [post.body];
  const clamped = Math.min(level, levels.length - 1);
  const sources = post.credibility?.sources ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addComment.mutate(draft.trim(), { onSuccess: () => setDraft("") });
  };

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-bg/80 hairline-b px-6 py-4 backdrop-blur-md">
        <Link
          href="/app"
          className="flex h-8 w-8 items-center justify-center hairline transition duration-fast hover:border-accent"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="font-mono text-2xs uppercase tracking-widest text-faint">
          Discovery
        </span>
      </header>

      <article className="px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <CategoryTag category={post.category} />
          <span className="font-mono text-2xs uppercase tracking-wider text-faint">
            {relativeTime(post.created_at)}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight">
          {post.headline}
        </h1>

        <div className="mt-5 flex items-center gap-2.5">
          <Avatar
            name={post.author.name}
            color={post.author.avatar_color}
            size={28}
          />
          <span className="font-mono text-2xs uppercase tracking-wider text-muted">
            {post.author.name}
          </span>
        </div>

        {/* Depth body */}
        <div className="mt-6 min-h-[6rem]">
          <p className="font-sans text-lg leading-relaxed text-text">
            {levels[clamped]}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <DepthDots
            count={levels.length}
            active={clamped}
            onSelect={setLevel}
          />
          <span className="font-mono text-2xs uppercase tracking-widest text-faint">
            {LEVEL_LABELS[clamped]}
          </span>
        </div>

        {/* Credibility */}
        <div className="mt-8 flex items-center gap-6 hairline bg-surfaceAlt p-5">
          <CredibilityArc score={post.credibility?.score ?? 0} size={96} stroke={5} />
          <div className="min-w-0">
            <p className="font-mono text-2xs uppercase tracking-widest text-faint">
              Verified by
            </p>
            <p className="font-display text-xl font-bold tabular-nums">
              {post.credibility?.verified_count ?? 0} curious minds
            </p>
          </div>
        </div>

        {sources.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-mono text-2xs uppercase tracking-widest text-faint">
              Sources
            </p>
            {sources.map((s, i) => (
              <SourceBadge key={i} source={s} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2 hairline-t pt-5">
          <button
            onClick={() => upvote.mutate(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 hairline transition duration-fast hover:border-accent",
              post.upvoted ? "text-accent" : "text-muted",
            )}
          >
            <ChevronUp size={18} />
            <span className="font-mono text-sm tabular-nums">{post.upvotes}</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-muted">
            <MessageSquare size={16} />
            <span className="font-mono text-sm tabular-nums">
              {post.comment_count}
            </span>
          </span>
          <button
            onClick={() => bookmark.mutate(post.id)}
            className={cn(
              "ml-auto flex items-center px-3 py-1.5 hairline transition duration-fast hover:border-accent",
              post.bookmarked ? "text-accent" : "text-muted",
            )}
          >
            <Bookmark
              size={16}
              fill={post.bookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </article>

      {/* Comments */}
      <section className="hairline-t px-6 py-8">
        <h2 className="mb-4 font-mono text-2xs uppercase tracking-widest text-faint">
          {post.comment_count} responses
        </h2>

        <form onSubmit={submit} className="mb-6">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add your thoughts…"
            rows={3}
            className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!draft.trim() || addComment.isPending}
              className="h-9 bg-accent px-4 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </form>

        <div className="space-y-5">
          {comments.data?.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar
                name={c.author.name}
                color={c.author.avatar_color}
                size={30}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-medium text-text">
                    {c.author.name}
                  </span>
                  <span className="font-mono text-2xs text-faint">
                    {relativeTime(c.created_at)}
                  </span>
                </div>
                <p className="mt-1 font-sans text-[15px] leading-relaxed text-muted">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
          {comments.data?.length === 0 && (
            <p className="font-mono text-2xs uppercase tracking-wider text-faint">
              No responses yet. Start the conversation.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
