import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "A daily hand-picked science discovery, plus curated collections to fall down a rabbit hole with.",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
