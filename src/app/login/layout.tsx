import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to Supasift to pick up your feed, your saved discoveries and the study circles you've joined.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
