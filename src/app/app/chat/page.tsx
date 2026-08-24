"use client";

import { ArrowLeft, Hash, MessagesSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { useAuthPrompt } from "@/lib/auth-prompt";
import { useAuth } from "@/lib/auth";
import { useRoomMessages, useRooms, useSendRoomMessage } from "@/lib/hooks";
import { relativeTime } from "@/lib/time";
import type { ChatRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Topic chat. Readable by everyone — signed-out visitors can browse rooms and
 * follow conversations, and only get the sign-in prompt when they try to send.
 * Messages refresh by polling; see POLL_INTERVAL_MS in lib/hooks for why we
 * poll rather than use the WebSocket endpoint.
 */
export default function ChatPage() {
  const rooms = useRooms();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default to the most recently active room on desktop, but on mobile keep
  // the list visible until the user picks one.
  const active =
    rooms.data?.find((r) => r.id === selectedId) ?? rooms.data?.[0] ?? null;

  return (
    <div className="flex">
      {/* ---- Room list ---- */}
      <div
        className={cn(
          "w-full shrink-0 md:w-[280px] md:hairline-r",
          selectedId ? "hidden md:block" : "block",
        )}
      >
        <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-4 py-5 backdrop-blur-md md:px-5">
          <h1 className="font-display text-xl font-bold tracking-tight">
            Rooms
          </h1>
          <p className="mt-1 font-mono text-2xs uppercase tracking-wider text-faint">
            One per field
          </p>
        </header>

        <div className="p-2">
          {rooms.isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="m-2 h-12 animate-pulse bg-surfaceAlt" />
            ))}

          {rooms.isError && (
            <p className="px-3 py-6 text-center font-mono text-2xs uppercase tracking-wider text-muted">
              Could not load rooms.
            </p>
          )}

          {rooms.data?.length === 0 && (
            <p className="px-3 py-6 text-center font-mono text-2xs uppercase tracking-wider text-faint">
              No rooms yet.
            </p>
          )}

          {rooms.data?.map((r) => (
            <RoomListItem
              key={r.id}
              room={r}
              active={active?.id === r.id}
              onSelect={() => setSelectedId(r.id)}
            />
          ))}
        </div>
      </div>

      {/* ---- Thread ---- */}
      <div className={cn("min-w-0 flex-1", selectedId ? "block" : "hidden md:block")}>
        {active ? (
          <Thread
            key={active.id}
            room={active}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <EmptyThread loading={rooms.isLoading} error={rooms.isError} />
        )}
      </div>
    </div>
  );
}

function RoomListItem({
  room,
  active,
  onSelect,
}: {
  room: ChatRoom;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2 px-3 py-2.5 text-left transition duration-fast",
        active ? "bg-surfaceAlt" : "hover:bg-surfaceAlt/60",
      )}
    >
      <Hash
        size={15}
        className={cn("mt-0.5 shrink-0", active ? "text-accent" : "text-faint")}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-sans text-sm font-medium text-text">
            {room.name}
          </span>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
            {room.member_count}
          </span>
        </span>
        <span className="mt-0.5 block truncate font-sans text-2xs text-faint">
          {room.last_message ?? "No messages yet"}
        </span>
      </span>
      {room.unread > 0 && (
        <span className="mt-0.5 flex h-4 min-w-4 shrink-0 items-center justify-center bg-accent px-1 font-mono text-[10px] font-bold text-accentText">
          {room.unread}
        </span>
      )}
    </button>
  );
}

function EmptyThread({
  loading,
  error,
}: {
  loading: boolean;
  error: boolean;
}) {
  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col items-center justify-center px-6 text-center md:h-screen">
      {loading ? (
        <span className="h-6 w-6 animate-spin border-2 border-accent border-t-transparent" />
      ) : (
        <>
          <span className="mb-4 flex h-12 w-12 items-center justify-center hairline">
            <MessagesSquare size={20} className="text-accent" />
          </span>
          <p className="font-sans text-[15px] text-muted">
            {error
              ? "Could not load rooms. Check your connection."
              : "Pick a room to start reading."}
          </p>
        </>
      )}
    </div>
  );
}

function Thread({ room, onBack }: { room: ChatRoom; onBack: () => void }) {
  const { user } = useAuth();
  const { prompt } = useAuthPrompt();
  const messages = useRoomMessages(room.id);
  const send = useSendRoomMessage(room.id);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const count = messages.data?.length ?? 0;

  // Stick to the newest message as history loads and new ones poll in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [count, room.id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      prompt({ message: `Sign in to post in #${room.name}.` });
      return;
    }
    if (!draft.trim()) return;
    send.mutate(draft.trim(), { onSuccess: () => setDraft("") });
  };

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col md:h-screen">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-bg/80 hairline-b px-4 py-4 backdrop-blur-md md:px-6">
        <button
          onClick={onBack}
          aria-label="Back to rooms"
          className="-ml-1 flex h-9 w-9 items-center justify-center text-muted transition duration-fast hover:text-text md:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <Hash size={16} className="shrink-0 text-accent" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold leading-tight tracking-tight">
            {room.name}
          </p>
          <p className="hidden truncate font-sans text-2xs text-faint sm:block">
            {room.description}
          </p>
        </div>
        <span className="ml-auto shrink-0 font-mono text-2xs uppercase tracking-wider text-faint">
          {room.member_count} members
        </span>
      </header>

      {/* ---- Messages ---- */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-6 md:px-6">
        {messages.isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-surfaceAlt" />
            ))}
          </div>
        )}

        {messages.isError && (
          <p className="py-10 text-center font-mono text-2xs uppercase tracking-wider text-muted">
            Could not load messages.
          </p>
        )}

        {messages.data && messages.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center hairline">
              <MessagesSquare size={20} className="text-accent" />
            </span>
            <p className="font-sans text-[15px] text-muted">
              No messages in #{room.name} yet.
            </p>
            <p className="mt-1 font-mono text-2xs uppercase tracking-wider text-faint">
              {user ? "Say the first thing." : "Sign in to say the first thing."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.data?.map((m) => {
            const mine = m.author.id === user?.id;
            return (
              <div
                key={m.id}
                className={cn("flex gap-3", mine && "flex-row-reverse")}
              >
                <Avatar
                  name={m.author.name}
                  color={m.author.avatar_color}
                  src={m.author.avatar_url}
                  size={28}
                />
                <div className={cn("max-w-[75%] min-w-0", mine && "text-right")}>
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      mine && "flex-row-reverse",
                    )}
                  >
                    <span className="font-sans text-sm font-medium text-text">
                      {mine ? "You" : m.author.name}
                    </span>
                    <span className="font-mono text-2xs text-faint">
                      {relativeTime(m.created_at)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-1 inline-block px-3 py-2 text-left font-sans text-[15px] leading-relaxed",
                      mine ? "bg-accentSoft text-text" : "bg-surfaceAlt text-text",
                    )}
                  >
                    {m.body}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ---- Composer ---- */}
      <form onSubmit={submit} className="hairline-t px-4 py-4 md:px-6">
        {send.isError && (
          <p className="mb-2 font-mono text-2xs uppercase tracking-wide text-heart">
            Message failed to send. Try again.
          </p>
        )}
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              user ? `Message #${room.name}` : `Sign in to post in #${room.name}`
            }
            aria-label={`Message ${room.name}`}
            className="h-11 min-w-0 flex-1 hairline bg-surface px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
          />
          <button
            type="submit"
            aria-label="Send message"
            // Signed-out visitors keep an enabled button so the click can open
            // the sign-in prompt rather than silently doing nothing.
            disabled={!!user && (!draft.trim() || send.isPending)}
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
