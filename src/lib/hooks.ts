"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "./api";
import type { FeedKind, Post, Question, StudyCircle } from "./types";

/**
 * Real-time strategy: short-interval polling, not WebSockets.
 *
 * The API does expose `/chat/ws/room/{id}`, but its ConnectionManager keeps
 * subscribers in a per-process dict. That only works with a single worker —
 * as soon as Railway runs more than one replica, a socket connected to
 * replica A never sees a message broadcast on replica B, and the failure is
 * silent. Polling is stateless, survives replica restarts and idle-connection
 * timeouts, and needs no reconnect/backoff logic. At this scale the extra
 * request volume is negligible, and it degrades gracefully instead of
 * appearing to work while silently dropping messages.
 */
const POLL_INTERVAL_MS = 5000;

// ---- Posts / feed ----
export function useFeed(feed: FeedKind, category: string) {
  return useQuery({
    queryKey: ["feed", feed, category],
    queryFn: () => api.getFeed({ feed, category }),
  });
}

export function usePost(id: string, initialData?: Post) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => api.getPost(id),
    enabled: !!id,
    // Seeded from the server render so the article lands in the initial HTML.
    // It is stale on arrival, so the client still refetches for signed-in state.
    initialData,
  });
}

function patchPostEverywhere(qc: ReturnType<typeof useQueryClient>, updated: Post) {
  qc.setQueryData(["post", updated.id], updated);
  qc.setQueriesData<Post[]>({ queryKey: ["feed"] }, (old) =>
    old?.map((p) => (p.id === updated.id ? updated : p)),
  );
  qc.setQueriesData<Post[]>({ queryKey: ["userPosts"] }, (old) =>
    old?.map((p) => (p.id === updated.id ? updated : p)),
  );
  qc.setQueriesData<Post[]>({ queryKey: ["library"] }, (old) =>
    old?.map((p) => (p.id === updated.id ? updated : p)),
  );
}

export function useUpvote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleUpvote(id),
    onSuccess: (updated) => patchPostEverywhere(qc, updated),
  });
}

export function useBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleBookmark(id),
    onSuccess: (updated) => patchPostEverywhere(qc, updated),
  });
}

export function useLibrary() {
  return useQuery({ queryKey: ["library"], queryFn: () => api.getLibrary() });
}

export function useUserPosts(userId?: string) {
  return useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => api.getUserPosts(userId as string),
    enabled: !!userId,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: () => api.getTrending(),
  });
}

export function useDailyDiscovery() {
  return useQuery({
    queryKey: ["daily-discovery"],
    queryFn: () => api.getDailyDiscovery(),
  });
}

// ---- Comments ----
export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => api.getComments(postId),
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => api.addComment(postId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

// ---- Content / Explore ----
export function useDaily() {
  return useQuery({ queryKey: ["daily"], queryFn: () => api.getDaily() });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => api.getCollections(),
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => api.getCollection(id),
    enabled: !!id,
  });
}

// ---- Questions ----
export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => api.getQuestions(),
  });
}

export function useFollowQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.followQuestion(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["questions"] });
      const prev = qc.getQueryData<Question[]>(["questions"]);
      qc.setQueryData<Question[]>(["questions"], (old) =>
        old?.map((q) =>
          q.id === id
            ? {
                ...q,
                following: !q.following,
                follower_count: q.follower_count + (q.following ? -1 : 1),
              }
            : q,
        ),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["questions"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["questions"] }),
  });
}

// ---- Study Circles ----
export function useCircles() {
  return useQuery({ queryKey: ["circles"], queryFn: () => api.getCircles() });
}

export function useJoinCircle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.joinCircle(id),
    onSuccess: (updated) =>
      qc.setQueryData<StudyCircle[]>(["circles"], (old) =>
        old?.map((c) => (c.id === updated.id ? updated : c)),
      ),
    onError: () => qc.invalidateQueries({ queryKey: ["circles"] }),
  });
}

export function useLeaveCircle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.leaveCircle(id),
    onSuccess: (updated) =>
      qc.setQueryData<StudyCircle[]>(["circles"], (old) =>
        old?.map((c) => (c.id === updated.id ? updated : c)),
      ),
    onError: () => qc.invalidateQueries({ queryKey: ["circles"] }),
  });
}

export function useCircle(id: string) {
  return useQuery({
    queryKey: ["circle", id],
    queryFn: () => api.getCircle(id),
    enabled: !!id,
  });
}

export function useCircleMessages(id: string) {
  return useQuery({
    queryKey: ["circle-messages", id],
    queryFn: () => api.getCircleMessages(id),
    enabled: !!id,
    // Circle discussions are slower-moving than chat, so a gentler cadence.
    refetchInterval: POLL_INTERVAL_MS * 2,
  });
}

export function useSendCircleMessage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => api.sendCircleMessage(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["circle-messages", id] }),
  });
}

/**
 * Joining/leaving from the circle page needs the detail payload (roster,
 * member count) refreshed as well as the sidebar list.
 */
export function useCircleMembership(id: string) {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["circle", id] });
    qc.invalidateQueries({ queryKey: ["circles"] });
    qc.invalidateQueries({ queryKey: ["circle-messages", id] });
  };
  const join = useMutation({
    mutationFn: () => api.joinCircle(id),
    onSuccess: refresh,
  });
  const leave = useMutation({
    mutationFn: () => api.leaveCircle(id),
    onSuccess: refresh,
  });
  return { join, leave };
}

// ---- Chat ----
export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.getRooms(),
    // Keeps last-message previews and unread badges fresh in the sidebar.
    refetchInterval: POLL_INTERVAL_MS * 3,
  });
}

export function useRoomMessages(roomId?: string) {
  return useQuery({
    queryKey: ["room-messages", roomId],
    queryFn: () => api.getRoomMessages(roomId as string),
    enabled: !!roomId,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useSendRoomMessage(roomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => api.sendRoomMessage(roomId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["room-messages", roomId] });
      // Refresh the room list so the preview line updates immediately.
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useDMs() {
  return useQuery({ queryKey: ["dms"], queryFn: () => api.getDMs() });
}

// ---- Notifications ----
export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread"],
    queryFn: () => api.unreadCount(),
  });
}
