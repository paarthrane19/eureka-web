"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";

import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/Logo";

export function LandingHeader() {
  const { isDark, toggle } = useTheme();
  return (
    <header className="fixed inset-x-0 top-0 z-50 hairline-b bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-auto" priority />
          <span className="hidden font-mono text-2xs tracking-widest text-faint sm:inline">
            / THE SCIENCE NETWORK
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center text-muted transition duration-fast hover:text-accent"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/login"
            className="flex h-9 items-center px-3 font-mono text-2xs uppercase tracking-wider text-muted transition duration-fast hover:text-accent"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="flex h-9 items-center bg-accent px-4 font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
