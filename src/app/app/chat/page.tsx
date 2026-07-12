"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Hash, Send } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRooms } from "@/lib/hooks";
import { relativeTime } from "@/lib/time";
import type { ChatRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

function Thread({ room }: { room: ChatRoom }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");

  const messages = useQuery({
    queryKey: ["room-messages", room.id],
    queryFn: () => api.getRoomMessages(room.id),
    refetchInterval: 5000,
  });

  const send = useMutation({
    mutationFn: (body: string) => api.sendRoomMessage(room.id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["room-messages", room.id] }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    send.mutate(draft.trim(), { onSuccess: () => setDraft("") });
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-bg/80 hairline-b px-6 py-4 backdrop-blur-md">
        <Hash size={16} className="text-accent" />
        <span className="font-display text-lg font-bold tracking-tight">
          {room.name}
        </span>
        <span className="ml-auto font-mono text-2xs uppercase tracking-wider text-faint">
          {room.member_count} members
        </span>
      </header>

      <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto scroll-thin px-6 py-6">
        {messages.data
          ?.slice()
          .reverse()
          .map((m) => {
            const mine = m.author.id === user?.id;
            return (
              <div
                key={m.id}
                className={cn("flex gap-3", mine && "flex-row-reverse")}
              >
                <Avatar
                  name={m.author.name}
                  color={m.author.avatar_color}
                  size={28}
                />
                <div className={cn("max-w-[75%]", mine && "text-right")}>
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
                      "mt-1 inline-block px-3 py-2 font-sans text-[15px] leading-relaxed",
                      mine
                        ? "bg-accentSoft text-text"
                        : "bg-surfaceAlt text-text",
                    )}
                  >
                    {m.body}
                  </p>
                </div>
              </div>
            );
          })}
        {messages.data?.length === 0 && (
          <p className="text-center font-mono text-2xs uppercase tracking-wider text-faint">
            No messages yet. Say hello.
          </p>
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2 hairline-t px-6 py-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message #${room.name}`}
          className="h-11 flex-1 hairline bg-surface px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
        />
        <button
          type="submit"
          disabled={!draft.trim() || send.isPending}
          className="flex h-11 w-11 items-center justify-center bg-accent text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const rooms = useRooms();
  const [selected, setSelected] = useState<ChatRoom | null>(null);

  const active = selected ?? rooms.data?.[0] ?? null;

  return (
    <div className="flex">
      {/* Room list */}
      <div className="w-[260px] shrink-0 hairline-r">
        <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-5 py-5 backdrop-blur-md">
          <h1 className="font-display text-xl font-bold tracking-tight">
            Rooms
          </h1>
        </header>
        <div className="p-2">
          {rooms.data?.map((r) => {
            const isActive = active?.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left transition duration-fast",
                  isActive ? "bg-surfaceAlt" : "hover:bg-surfaceAlt/60",
                )}
              >
                <Hash
                  size={15}
                  className={isActive ? "text-accent" : "text-faint"}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans text-sm font-medium text-text">
                    {r.name}
                  </span>
                  {r.last_message && (
                    <span className="block truncate font-sans text-2xs text-faint">
                      {r.last_message}
                    </span>
                  )}
                </span>
                {r.unread > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[10px] font-bold text-accentText">
                    {r.unread}
                  </span>
                )}
              </button>
            );
          })}
          {rooms.isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="m-2 h-10 animate-pulse bg-surfaceAlt" />
            ))}
        </div>
      </div>

      {/* Thread */}
      <div className="min-w-0 flex-1">
        {active ? (
          <Thread key={active.id} room={active} />
        ) : (
          <div className="flex h-screen items-center justify-center font-mono text-sm text-faint">
            {rooms.isError ? "Could not load rooms." : "Select a room"}
          </div>
        )}
      </div>
    </div>
  );
}
