"use client";

import { BottomNav } from "@/components/app/BottomNav";
import { LeftSidebar } from "@/components/app/LeftSidebar";
import { MobileTopBar } from "@/components/app/MobileTopBar";
import { RightSidebar } from "@/components/app/RightSidebar";
import { useAuth } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // Public preview: anyone can browse the app shell signed-out. We only wait on
  // the initial auth bootstrap so personalised state (upvotes, etc.) is known
  // before first paint; we never redirect unauthenticated visitors away.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-6 w-6 animate-spin border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1320px] bg-bg text-text">
      <LeftSidebar />
      <div className="flex min-w-0 flex-1 flex-col hairline-r">
        <MobileTopBar />
        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <RightSidebar />
      <BottomNav />
    </div>
  );
}
