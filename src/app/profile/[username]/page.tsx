import type { Metadata } from "next";

import { API_BASE_URL } from "@/lib/api";
import type { User } from "@/lib/types";

import { PublicProfileClient } from "./PublicProfileClient";

// Server-side fetch used only for building share/SEO metadata. Profile reads are
// public on the API, so no auth header is needed.
async function fetchUser(username: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/by-username/${encodeURIComponent(username)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await fetchUser(params.username);
  if (!user) {
    return { title: "Profile not found", robots: { index: false } };
  }

  const title = `${user.name} (@${user.username})`;
  const description =
    user.bio?.trim() ||
    `${user.name} shares verified science discoveries on Supasift.`;
  const url = `/profile/${user.username}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "profile" },
    twitter: { card: "summary", title, description },
  };
}

export default function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return <PublicProfileClient username={params.username} />;
}
