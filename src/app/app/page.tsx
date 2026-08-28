import type { Metadata } from "next";

import { FeedClient } from "./FeedClient";

export const metadata: Metadata = {
  title: "Your feed",
  description:
    "Verified science discoveries from the researchers, topics and study circles you follow on Supasift.",
};

export default function FeedPage() {
  return <FeedClient />;
}
