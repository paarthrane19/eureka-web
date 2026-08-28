import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "A curated Supasift collection of science discoveries on a single theme.",
  robots: { index: false, follow: false },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
