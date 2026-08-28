import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Join Supasift free — follow the science you care about, save discoveries and go three levels deeper on any finding.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
