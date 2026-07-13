"use client";

import { LogOut, Moon, Sparkles, Sun } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

// Minimal mobile header: the Eureka wordmark plus quick actions. Shown under md,
// where the LeftSidebar is hidden. Not sticky, so page headers own the top edge
// once you scroll.
export function MobileTopBar() {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between hairline-b bg-bg px-4 py-2.5 md:hidden">
      <Link href="/app" className="inline-flex items-center">
        <Logo className="h-7 w-auto" priority />
      </Link>
      <div className="flex items-center gap-0.5">
        <Link
          href="/app/discover"
          aria-label="Discover"
          className="flex h-11 w-11 items-center justify-center text-muted transition duration-fast hover:text-text"
        >
          <Sparkles size={20} />
        </Link>
        <button
          onClick={toggle}
          aria-label={isDark ? "Light mode" : "Dark mode"}
          className="flex h-11 w-11 items-center justify-center text-muted transition duration-fast hover:text-text"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={logout}
          aria-label="Log out"
          className="flex h-11 w-11 items-center justify-center text-muted transition duration-fast hover:text-heart"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
