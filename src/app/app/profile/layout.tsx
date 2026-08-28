import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your profile",
  description:
    "Your Supasift profile, published discoveries and credibility score.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
