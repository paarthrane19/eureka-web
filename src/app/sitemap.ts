import type { MetadataRoute } from "next";

import { API_BASE_URL } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/types";

// Rebuild the sitemap hourly so newly published discoveries get indexed.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/app",
    "/app/explore",
    "/app/discover",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.7,
  }));

  let posts: Post[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/posts?feed=all&limit=50`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) posts = (await res.json()) as Post[];
  } catch {
    // Network/API hiccup: still return the static routes rather than 500.
  }

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/app/post/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
