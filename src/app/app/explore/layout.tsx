import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore science",
  description:
    "Browse verified discoveries across physics, astronomy, biology, chemistry, maths, earth science, technology and medicine.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
