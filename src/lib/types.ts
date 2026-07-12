export const CATEGORIES = [
  "Physics",
  "Astronomy",
  "Biology",
  "Chemistry",
  "Math",
  "Earth Science",
  "Technology",
  "Medicine",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Author {
  id: string;
  username: string;
  name: string;
  avatar_color: string;
  avatar_url: string | null;
  verified: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  interests: string[];
  avatar_color: string;
  avatar_url: string | null;
  cover_image: string | null;
  link: string | null;
  location: string | null;
  working_at: string | null;
  verified: boolean;
  pinned_post_id: string | null;
  post_count: number;
  credibility_score: number;
  created_at: string;
}

export type SourceType =
  | "journal"
  | "university"
  | "article"
  | "dataset"
  | "preprint";

export interface Source {
  title: string;
  url: string;
  source_type: SourceType | string;
}

export interface Credibility {
  score: number;
  verified_count: number;
  sources: Source[];
}

export interface Post {
  id: string;
  headline: string;
  body: string;
  levels: string[];
  credibility: Credibility;
  category: string;
  source_url: string | null;
  author: Author;
  created_at: string;
  upvotes: number;
  comment_count: number;
  upvoted: boolean;
  bookmarked: boolean;
  images: string[];
  pinned: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  follower_count: number;
  following: boolean;
  answer_count: number;
  created_at: string;
}

export interface StudyCircle {
  id: string;
  name: string;
  topic: string;
  category: string;
  description: string;
  member_count: number;
  capacity: number;
  joined: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  body: string;
  parent_id: string | null;
  author: Author;
  created_at: string;
}

export interface Notification {
  id: string;
  type: "upvote" | "comment" | string;
  actor: Author | null;
  post_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export type FeedKind = "for-you" | "all";

export interface ChatRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  member_count: number;
  joined: boolean;
  unread: number;
  last_message: string | null;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  room_id: string;
  author: Author;
  body: string;
  created_at: string;
}

export interface DMThread {
  id: string;
  other: Author;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
}

export interface DirectMessage {
  id: string;
  thread_id: string;
  sender: Author;
  body: string;
  created_at: string;
  read: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar_color: string;
  bio: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  emoji: string;
  item_count: number;
}

export interface CuratedContent {
  id: string;
  collection_id: string;
  title: string;
  body: string;
  source_url: string | null;
  category: string;
}

export interface CollectionDetail {
  collection: Collection;
  items: CuratedContent[];
}

export interface CategoryContent {
  category: string;
  collections: Collection[];
  items: CuratedContent[];
}

export interface DailyDiscovery {
  id: string;
  date: string;
  title: string;
  body: string;
  category: string;
  source_url: string | null;
  emoji: string;
}
