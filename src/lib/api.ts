import type {
  AuthResponse,
  CategoryContent,
  ChatRoom,
  Collection,
  CollectionDetail,
  Comment,
  Contact,
  DailyDiscovery,
  DirectMessage,
  DMThread,
  FeedKind,
  Message,
  Notification,
  Post,
  Question,
  StudyCircle,
  User,
} from "./types";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const TOKEN_KEY = "eureka-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your connection and the API URL.",
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const detail =
      (data && (data.detail || data.message)) ||
      `Request failed (${response.status}).`;
    const message = Array.isArray(detail)
      ? detail.map((d: { msg?: string }) => d.msg).join(", ")
      : detail;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

async function uploadImage(
  file: File,
  kind: "post" | "avatar" | "cover",
): Promise<{ data_url: string }> {
  const form = new FormData();
  form.append("file", file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    // No Content-Type header: the browser sets the multipart boundary itself.
    response = await fetch(`${API_BASE_URL}/uploads/image?kind=${kind}`, {
      method: "POST",
      headers,
      body: form,
    });
  } catch {
    throw new ApiError("Could not reach the server while uploading.", 0);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const detail =
      (data && (data.detail || data.message)) ||
      `Upload failed (${response.status}).`;
    throw new ApiError(
      Array.isArray(detail)
        ? detail.map((d: { msg?: string }) => d.msg).join(", ")
        : detail,
      response.status,
    );
  }
  return data as { data_url: string };
}

export const api = {
  // ---- Auth ----
  signup: (email: string, password: string, name: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login-json", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/auth/me"),

  updateProfile: (
    updates: Partial<
      Pick<
        User,
        | "name"
        | "bio"
        | "interests"
        | "link"
        | "location"
        | "working_at"
        | "avatar_url"
        | "cover_image"
      >
    >,
  ) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  pinPost: (postId: string | null) =>
    request<User>("/users/me/pin", {
      method: "PUT",
      body: JSON.stringify({ post_id: postId }),
    }),

  completeOnboarding: (interests: string[]) =>
    request<User>("/users/me/onboarding", {
      method: "POST",
      body: JSON.stringify({ interests }),
    }),

  // ---- Uploads ----
  uploadImage: (file: File, kind: "post" | "avatar" | "cover" = "post") =>
    uploadImage(file, kind),

  // ---- Posts ----
  getFeed: (params: { feed: FeedKind; category?: string; before?: string }) => {
    const q = new URLSearchParams({ feed: params.feed });
    if (params.category && params.category !== "All")
      q.set("category", params.category);
    if (params.before) q.set("before", params.before);
    return request<Post[]>(`/posts?${q.toString()}`);
  },

  getPost: (id: string) => request<Post>(`/posts/${id}`),

  createPost: (input: {
    headline: string;
    body: string;
    category: string;
    source_url?: string | null;
    images?: string[];
  }) =>
    request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  toggleUpvote: (id: string) =>
    request<Post>(`/posts/${id}/upvote`, { method: "POST" }),

  toggleBookmark: (id: string) =>
    request<Post>(`/posts/${id}/bookmark`, { method: "PUT" }),

  getLibrary: () => request<Post[]>("/posts/library"),

  getUserPosts: (userId: string) => request<Post[]>(`/users/${userId}/posts`),

  getUser: (userId: string) => request<User>(`/users/${userId}`),

  getUserByUsername: (username: string) =>
    request<User>(`/users/by-username/${encodeURIComponent(username)}`),

  // ---- Comments ----
  getComments: (postId: string) =>
    request<Comment[]>(`/posts/${postId}/comments`),

  addComment: (postId: string, body: string, parentId?: string | null) =>
    request<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, parent_id: parentId ?? null }),
    }),

  // ---- Notifications ----
  getNotifications: () => request<Notification[]>("/notifications"),

  unreadCount: () =>
    request<{ count: number }>("/notifications/unread-count"),

  markAllRead: () =>
    request<{ status: string }>("/notifications/read-all", { method: "POST" }),

  // ---- Chat: rooms ----
  getRooms: () => request<ChatRoom[]>("/chat/rooms"),

  joinRoom: (roomId: string) =>
    request<ChatRoom>(`/chat/rooms/${roomId}/join`, { method: "POST" }),

  leaveRoom: (roomId: string) =>
    request<{ status: string }>(`/chat/rooms/${roomId}/leave`, {
      method: "POST",
    }),

  getRoomMessages: (roomId: string, before?: string) => {
    const q = new URLSearchParams();
    if (before) q.set("before", before);
    const qs = q.toString();
    return request<Message[]>(
      `/chat/rooms/${roomId}/messages${qs ? `?${qs}` : ""}`,
    );
  },

  sendRoomMessage: (roomId: string, body: string) =>
    request<Message>(`/chat/rooms/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // ---- Chat: direct messages ----
  getContacts: () => request<Contact[]>("/chat/contacts"),

  getDMs: () => request<DMThread[]>("/chat/dms"),

  openDM: (userId: string) =>
    request<DMThread>(`/chat/dms/with/${userId}`, { method: "POST" }),

  getDMMessages: (threadId: string, before?: string) => {
    const q = new URLSearchParams();
    if (before) q.set("before", before);
    const qs = q.toString();
    return request<DirectMessage[]>(
      `/chat/dms/${threadId}/messages${qs ? `?${qs}` : ""}`,
    );
  },

  sendDM: (threadId: string, body: string) =>
    request<DirectMessage>(`/chat/dms/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // ---- Content / Explore ----
  getDaily: () => request<DailyDiscovery>("/content/daily", { auth: false }),

  getCollections: () =>
    request<Collection[]>("/content/collections", { auth: false }),

  getCollection: (id: string) =>
    request<CollectionDetail>(`/content/collections/${id}`, { auth: false }),

  getCategoryContent: (category: string) =>
    request<CategoryContent>(
      `/content/category/${encodeURIComponent(category)}`,
      { auth: false },
    ),

  // ---- Questions ----
  getQuestions: () => request<Question[]>("/questions"),

  followQuestion: (id: string) =>
    request<Question>(`/questions/${id}/follow`, { method: "POST" }),

  // ---- Study Circles ----
  getCircles: () => request<StudyCircle[]>("/circles"),

  joinCircle: (id: string) =>
    request<StudyCircle>(`/circles/${id}/join`, { method: "POST" }),

  leaveCircle: (id: string) =>
    request<StudyCircle>(`/circles/${id}/leave`, { method: "POST" }),

  // ---- Waitlist (public) ----
  joinWaitlist: (email: string) =>
    request<{ ok: boolean; count: number }>("/waitlist", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email }),
    }),

  waitlistCount: () =>
    request<{ count: number }>("/waitlist/count", { auth: false }),
};
