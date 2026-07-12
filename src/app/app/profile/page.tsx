"use client";

import { ProfileScreen } from "@/components/ProfileScreen";
import { useAuth } from "@/lib/auth";
import { useLibrary, useUserPosts } from "@/lib/hooks";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const posts = useUserPosts(user?.id);
  const library = useLibrary();

  if (!user) return null;

  return (
    <ProfileScreen
      user={user}
      posts={posts.data}
      savedPosts={library.data}
      isMe
      onUpdated={refresh}
    />
  );
}
