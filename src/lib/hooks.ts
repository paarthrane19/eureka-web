"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "./api";
import type { FeedKind, Post, Question, StudyCircle } from "./types";

// ---- Posts / feed ----
export function useFeed(feed: FeedKind, category: string) {
  return useQuery({
    queryKey: ["feed", feed, category],
    queryFn: () => api.getFeed({ feed, category }),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => api.getPost(id),
    enabled: !!id,
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

// ---- Chat ----
export function useRooms() {
  return useQuery({ queryKey: ["rooms"], queryFn: () => api.getRooms() });
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
