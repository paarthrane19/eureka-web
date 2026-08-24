"use client";

import { ProfileScreen } from "@/components/ProfileScreen";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useLibrary, useUserPosts } from "@/lib/hooks";

export default function ProfilePage() {
  return (
    <RequireAuth title="Sign in to view your profile">
      <OwnProfile />
    </RequireAuth>
  );
}

// Split out so the authed queries (library, user posts) only run once we know
// there is a signed-in user — keeps signed-out visitors from firing 401s.
function OwnProfile() {
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
