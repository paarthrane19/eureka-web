import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password",
  description:
    "Enter your email address and we'll send you a link to set a new Supasift password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
