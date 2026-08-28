import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study circle",
  description:
    "A small Supasift study circle working through one topic together.",
  robots: { index: false, follow: false },
};

export default function CircleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
