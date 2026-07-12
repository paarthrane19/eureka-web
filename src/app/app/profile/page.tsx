"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLibrary, useUserPosts } from "@/lib/hooks";
import { joinedDate } from "@/lib/time";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const posts = useUserPosts(user?.id);
  const library = useLibrary();

  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [levels, setLevels] = useState<Record<string, number>>({});

  const save = useMutation({
    mutationFn: () => api.updateProfile({ bio: bio.trim() }),
    onSuccess: async () => {
      await refresh();
      qc.invalidateQueries({ queryKey: ["userPosts"] });
      setEditing(false);
    },
  });

  if (!user) return null;

  const list = tab === "posts" ? posts.data : library.data;

  return (
    <div>
      <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-6 py-5 backdrop-blur-md">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Profile
        </h1>
      </header>

      {/* Identity */}
      <div className="px-6 py-8 hairline-b">
        <div className="flex items-start gap-4">
          <Avatar name={user.name} color={user.avatar_color} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {user.name}
            </h2>
            <p className="font-mono text-2xs uppercase tracking-wider text-faint">
              {user.email} · joined {joinedDate(user.created_at)}
            </p>

            {editing ? (
              <div className="mt-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell people what you're curious about."
                  className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => save.mutate()}
                    disabled={save.isPending}
                    className="flex h-8 items-center gap-1.5 bg-accent px-3 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition hover:brightness-105 disabled:opacity-50"
                  >
                    <Check size={13} /> Save
                  </button>
                  <button
                    onClick={() => {
                      setBio(user.bio ?? "");
                      setEditing(false);
                    }}
                    className="flex h-8 items-center gap-1.5 hairline px-3 font-mono text-2xs uppercase tracking-wider text-muted transition hover:border-accent"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-start gap-2">
                <p className="font-sans text-[15px] leading-relaxed text-muted">
                  {user.bio || "No bio yet."}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  aria-label="Edit bio"
                  className="shrink-0 text-faint transition hover:text-accent"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}

            {user.interests?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {user.interests.map((i) => (
                  <span
                    key={i}
                    className="hairline px-2 py-1 font-mono text-2xs uppercase tracking-wider text-muted"
                  >
                    {i}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 hairline-b">
        {(["posts", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "pb-3 font-mono text-xs uppercase tracking-widest transition duration-fast",
              tab === t
                ? "border-b-2 border-accent text-text"
                : "text-faint hover:text-muted",
            )}
          >
            {t === "posts" ? "Discoveries" : "Saved"}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {list?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            level={Math.min(
              levels[post.id] ?? 0,
              (post.levels?.length || 1) - 1,
            )}
            onLevelChange={(l) =>
              setLevels((prev) => ({ ...prev, [post.id]: l }))
            }
          />
        ))}
        {list?.length === 0 && (
          <p className="px-6 py-16 text-center font-mono text-2xs uppercase tracking-wider text-faint">
            {tab === "posts"
              ? "No discoveries yet."
              : "Nothing saved yet."}
          </p>
        )}
      </div>
    </div>
  );
}
