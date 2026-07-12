"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ProfileScreen } from "@/components/ProfileScreen";
import { api, getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { user: me } = useAuth();

  const userQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: () => api.getUserByUsername(username),
    enabled: !!username,
  });

  const user = userQuery.data;

  const postsQuery = useQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: () => api.getUserPosts(user!.id),
    // getUserPosts needs auth; skip the request for logged-out visitors.
    enabled: !!user?.id && !!getToken(),
  });

  if (userQuery.isLoading) {
    return (
      <div className="mx-auto max-w-feed px-6 py-24 text-center font-mono text-2xs uppercase tracking-widest text-faint">
        Loading…
      </div>
    );
  }

  if (userQuery.isError || !user) {
    return (
      <div className="mx-auto max-w-feed px-6 py-24 text-center">
        <p className="font-mono text-2xs uppercase tracking-widest text-faint">
          No account @{username}
        </p>
        <Link
          href="/app"
          className="mt-4 inline-block font-mono text-2xs uppercase tracking-wider text-accent hover:underline"
        >
          ← Back to Eureka
        </Link>
      </div>
    );
  }

  // Viewing your own public profile redirects behaviour to edit mode.
  const isMe = me?.id === user.id;

  return (
    <div className="mx-auto min-h-screen max-w-feed hairline-x">
      <ProfileScreen
        user={user}
        posts={postsQuery.data}
        isMe={isMe}
        onUpdated={() => userQuery.refetch().then(() => undefined)}
      />
    </div>
  );
}
