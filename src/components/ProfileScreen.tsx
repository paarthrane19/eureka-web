"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Camera,
  Check,
  LinkIcon,
  MapPin,
  Pin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { api } from "@/lib/api";
import { joinedDate } from "@/lib/time";
import type { Post, User } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Avatar } from "./Avatar";
import { PostCard } from "./PostCard";
import { VerifiedBadge } from "./VerifiedBadge";

function normalizeLink(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="font-mono text-lg font-bold tabular-nums text-text">
        {value}
      </div>
      <div className="font-mono text-2xs uppercase tracking-widest text-faint">
        {label}
      </div>
    </div>
  );
}

export function ProfileScreen({
  user,
  posts,
  savedPosts,
  isMe,
  onUpdated,
}: {
  user: User;
  posts?: Post[];
  savedPosts?: Post[];
  isMe: boolean;
  onUpdated?: () => void | Promise<void>;
}) {
  const qc = useQueryClient();
  const avatarInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const [editing, setEditing] = useState(false);
  const [levels, setLevels] = useState<Record<string, number>>({});

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [link, setLink] = useState(user.link ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [workingAt, setWorkingAt] = useState(user.working_at ?? "");
  const [interests, setInterests] = useState<string[]>(user.interests ?? []);

  const refreshAll = async () => {
    await onUpdated?.();
    qc.invalidateQueries({ queryKey: ["userPosts"] });
  };

  const save = useMutation({
    mutationFn: () =>
      api.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        link: link.trim(),
        location: location.trim(),
        working_at: workingAt.trim(),
        interests,
      }),
    onSuccess: async () => {
      await refreshAll();
      setEditing(false);
    },
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, kind }: { file: File; kind: "avatar" | "cover" }) => {
      const { data_url } = await api.uploadImage(file, kind);
      return api.updateProfile(
        kind === "avatar" ? { avatar_url: data_url } : { cover_image: data_url },
      );
    },
    onSuccess: refreshAll,
  });

  const pin = useMutation({
    mutationFn: (postId: string | null) => api.pinPost(postId),
    onSuccess: refreshAll,
  });

  const toggleInterest = (c: string) =>
    setInterests((prev) =>
      prev.includes(c) ? prev.filter((i) => i !== c) : [...prev, c],
    );

  // Pinned post floats to the top of the discoveries list.
  const ordered = posts
    ? [...posts].sort((a, b) => Number(b.pinned) - Number(a.pinned))
    : undefined;
  const list = tab === "posts" ? ordered : savedPosts;

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-bg/80 hairline-b px-6 py-5 backdrop-blur-md">
        <h1 className="flex items-center gap-1.5 font-display text-2xl font-bold tracking-tight">
          {isMe ? "Profile" : user.name}
          {!isMe && user.verified && <VerifiedBadge size={18} />}
        </h1>
      </header>

      {/* Cover */}
      <div className="relative h-40 w-full overflow-hidden bg-surfaceAlt hairline-b">
        {user.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.cover_image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surfaceAlt to-surface" />
        )}
        {isMe && (
          <button
            onClick={() => coverInput.current?.click()}
            className="absolute right-3 top-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 font-mono text-2xs uppercase tracking-wider text-white transition hover:bg-black/80"
          >
            <Camera size={12} /> Cover
          </button>
        )}
      </div>

      {/* Identity */}
      <div className="px-6 pb-6 hairline-b">
        <div className="-mt-10 flex items-end justify-between">
          <div className="relative">
            <Avatar
              name={user.name}
              color={user.avatar_color}
              src={user.avatar_url}
              size={80}
              className="rounded-full border-4 border-bg"
            />
            {isMe && (
              <button
                onClick={() => avatarInput.current?.click()}
                aria-label="Change photo"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg bg-accent text-accentText transition hover:brightness-105"
              >
                <Camera size={13} />
              </button>
            )}
          </div>

          {isMe && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="mb-1 flex h-9 items-center gap-1.5 hairline px-4 font-mono text-2xs uppercase tracking-wider text-muted transition hover:border-accent"
            >
              Edit profile
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-4 space-y-3">
            <EditField label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                className="w-full hairline bg-surface px-3 py-2 font-sans text-[15px] text-text outline-none focus:border-accent"
              />
            </EditField>
            <EditField label={`Bio (${bio.length}/160)`}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 160))}
                rows={3}
                maxLength={160}
                placeholder="Tell people what you're curious about."
                className="w-full resize-none hairline bg-surface p-3 font-sans text-[15px] text-text outline-none placeholder:text-faint focus:border-accent"
              />
            </EditField>
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Location">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={60}
                  placeholder="City, Country"
                  className="w-full hairline bg-surface px-3 py-2 font-sans text-sm text-text outline-none placeholder:text-faint focus:border-accent"
                />
              </EditField>
              <EditField label="Studying / working at">
                <input
                  value={workingAt}
                  onChange={(e) => setWorkingAt(e.target.value)}
                  maxLength={60}
                  placeholder="Institution"
                  className="w-full hairline bg-surface px-3 py-2 font-sans text-sm text-text outline-none placeholder:text-faint focus:border-accent"
                />
              </EditField>
            </div>
            <EditField label="Link">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                maxLength={200}
                placeholder="yoursite.org"
                className="w-full hairline bg-surface px-3 py-2 font-mono text-sm text-text outline-none placeholder:text-faint focus:border-accent"
              />
            </EditField>
            <EditField label="Interests">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleInterest(c)}
                    className={cn(
                      "px-2.5 py-1 font-mono text-2xs uppercase tracking-wider transition duration-fast",
                      interests.includes(c)
                        ? "bg-accent text-accentText"
                        : "hairline text-muted hover:border-accent",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </EditField>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending || !name.trim()}
                className="flex h-9 items-center gap-1.5 bg-accent px-4 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition hover:brightness-105 disabled:opacity-50"
              >
                <Check size={14} /> {save.isPending ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setName(user.name);
                  setBio(user.bio ?? "");
                  setLink(user.link ?? "");
                  setLocation(user.location ?? "");
                  setWorkingAt(user.working_at ?? "");
                  setInterests(user.interests ?? []);
                  setEditing(false);
                }}
                className="flex h-9 items-center gap-1.5 hairline px-4 font-mono text-2xs uppercase tracking-wider text-muted transition hover:border-accent"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {user.name}
              </h2>
              {user.verified && <VerifiedBadge size={16} />}
            </div>
            <p className="font-mono text-2xs uppercase tracking-wider text-faint">
              @{user.username}
            </p>

            {user.bio && (
              <p className="mt-3 max-w-prose font-sans text-[15px] leading-relaxed text-muted">
                {user.bio}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-2xs uppercase tracking-wider text-faint">
              {user.working_at && (
                <span className="flex items-center gap-1.5">
                  <Briefcase size={12} /> {user.working_at}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} /> {user.location}
                </span>
              )}
              {user.link && (
                <a
                  href={normalizeLink(user.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-accent transition hover:underline"
                >
                  <LinkIcon size={12} /> {user.link.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>

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

            {/* Stats */}
            <div className="mt-5 flex gap-8">
              <Stat value={user.post_count} label="Discoveries" />
              <Stat value={user.credibility_score} label="Credibility" />
              <Stat value={joinedDate(user.created_at)} label="Joined" />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 hairline-b">
        <button
          onClick={() => setTab("posts")}
          className={cn(
            "pb-3 font-mono text-xs uppercase tracking-widest transition duration-fast",
            tab === "posts"
              ? "border-b-2 border-accent text-text"
              : "text-faint hover:text-muted",
          )}
        >
          Discoveries
        </button>
        {isMe && (
          <button
            onClick={() => setTab("saved")}
            className={cn(
              "pb-3 font-mono text-xs uppercase tracking-widest transition duration-fast",
              tab === "saved"
                ? "border-b-2 border-accent text-text"
                : "text-faint hover:text-muted",
            )}
          >
            Saved
          </button>
        )}
      </div>

      {/* List */}
      <div>
        {list?.map((post) => (
          <div key={post.id} className="relative">
            {isMe && tab === "posts" && (
              <button
                onClick={() => pin.mutate(post.pinned ? null : post.id)}
                disabled={pin.isPending}
                className={cn(
                  "absolute right-6 top-6 z-10 flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition disabled:opacity-50",
                  post.pinned
                    ? "text-accent"
                    : "text-faint hover:text-accent",
                )}
              >
                <Pin size={11} /> {post.pinned ? "Unpin" : "Pin"}
              </button>
            )}
            <PostCard
              post={post}
              level={Math.min(
                levels[post.id] ?? 0,
                (post.levels?.length || 1) - 1,
              )}
              onLevelChange={(l) =>
                setLevels((prev) => ({ ...prev, [post.id]: l }))
              }
            />
          </div>
        ))}
        {list?.length === 0 && (
          <p className="px-6 py-16 text-center font-mono text-2xs uppercase tracking-wider text-faint">
            {tab === "posts" ? "No discoveries yet." : "Nothing saved yet."}
          </p>
        )}
      </div>

      {!isMe && (
        <div className="px-6 py-8 text-center">
          <Link
            href="/app"
            className="font-mono text-2xs uppercase tracking-wider text-faint transition hover:text-accent"
          >
            ← Back to feed
          </Link>
        </div>
      )}

      {/* Hidden upload inputs (own profile only) */}
      {isMe && (
        <>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage.mutate({ file: f, kind: "avatar" });
              e.target.value = "";
            }}
          />
          <input
            ref={coverInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage.mutate({ file: f, kind: "cover" });
              e.target.value = "";
            }}
          />
        </>
      )}
    </div>
  );
}

function EditField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
