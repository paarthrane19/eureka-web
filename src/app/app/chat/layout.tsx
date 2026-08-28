import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Your Supasift conversations and topic rooms.",
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
