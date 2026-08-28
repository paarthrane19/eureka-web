import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share a discovery",
  description:
    "Publish a science discovery to Supasift with sources and three levels of depth.",
  robots: { index: false, follow: false },
};

export default function ComposeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
