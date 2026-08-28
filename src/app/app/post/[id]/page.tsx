import type { Metadata } from "next";

import { API_BASE_URL } from "@/lib/api";
import { metaDescription, SITE_NAME, SITE_URL } from "@/lib/site";
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

// Only absolute http(s) images unfurl on social or validate in schema.org
// markup; uploaded data-URLs do neither.
function shareableImage(post: Post): string | undefined {
  const first = post.images?.[0];
  return first && /^https?:\/\//.test(first) ? first : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await fetchPost(params.id);
  if (!post) {
    return { title: "Discovery not found", robots: { index: false } };
  }

  const description = metaDescription(post.levels?.[0] || post.body || "");
  // Falls back to the site's default /og card by leaving openGraph.images unset.
  const image = shareableImage(post);
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
      publishedTime: post.created_at,
      authors: [`${SITE_URL}/profile/${post.author.username}`],
      section: post.category,
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

function articleSchema(post: Post) {
  const url = `${SITE_URL}/app/post/${post.id}`;
  const image = shareableImage(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.headline,
    description: metaDescription(post.levels?.[0] || post.body || ""),
    articleBody: post.levels?.join("\n\n") || post.body,
    articleSection: post.category,
    datePublished: post.created_at,
    dateModified: post.created_at,
    inLanguage: "en",
    ...(image ? { image: [image] } : {}),
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${SITE_URL}/profile/${post.author.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-512.png` },
    },
    // Every discovery is published with its sources; exposing them as citations
    // is what lets a search engine treat this as sourced science rather than
    // an unattributed summary.
    ...(post.credibility?.sources?.length
      ? {
          citation: post.credibility.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
          })),
        }
      : {}),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.upvotes,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.comment_count,
      },
    ],
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await fetchPost(params.id);

  return (
    <>
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema(post)),
          }}
        />
      )}
      <PostDetailClient id={params.id} initialPost={post ?? undefined} />
    </>
  );
}
