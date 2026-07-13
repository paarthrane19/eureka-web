"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BottomNav } from "@/components/app/BottomNav";
import { LeftSidebar } from "@/components/app/LeftSidebar";
import { MobileTopBar } from "@/components/app/MobileTopBar";
import { RightSidebar } from "@/components/app/RightSidebar";
import { useAuth } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
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
