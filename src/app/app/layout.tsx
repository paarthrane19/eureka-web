"use client";

import { BottomNav } from "@/components/app/BottomNav";
import { LeftSidebar } from "@/components/app/LeftSidebar";
import { MobileTopBar } from "@/components/app/MobileTopBar";
import { RightSidebar } from "@/components/app/RightSidebar";
import { useAuth } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // Public preview: anyone can browse the app shell signed-out. We never redirect
  // unauthenticated visitors away. The bootstrap spinner is an overlay rather than
  // an early return so `children` stay mounted — returning early would drop the
  // whole subtree (page content and its JSON-LD) out of the server-rendered HTML.
  return (
    <div className="mx-auto flex min-h-screen max-w-[1320px] bg-bg text-text">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
          <span className="h-6 w-6 animate-spin border-2 border-accent border-t-transparent" />
        </div>
      )}
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
