import type { Metadata } from "next";

import { API_BASE_URL } from "@/lib/api";
import type { Post } from "@/lib/types";

import { PostDetailClient } from "./PostDetailClient";

// Server-side fetch used only for building share/SEO metadata. Reads are public
// on the API, so no auth header is needed. Failures fall back to generic tags.
async function fetchPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      // Cache briefly so crawlers/social unfurlers don't hammer the API.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Post;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await fetchPost(params.id);
  if (!post) {
    return { title: "Discovery" };
  }

  const description = (post.levels?.[0] || post.body || "").slice(0, 200);
  // Only absolute http(s) images unfurl on social; uploaded data-URLs don't, so
  // fall back to the site's default /og card in that case (inherited from the
  // root layout by leaving openGraph.images unset).
  const first = post.images?.[0];
  const image = first && /^https?:\/\//.test(first) ? first : undefined;
  const url = `/app/post/${post.id}`;

  return {
    title: post.headline,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.headline,
      description,
      url,
      type: "article",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.headline,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PostDetailClient id={params.id} />;
}
