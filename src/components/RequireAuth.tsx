"use client";

import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth";

/**
 * Wraps pages that only make sense for a signed-in user (compose, chat, own
 * profile). Signed-out visitors get a friendly sign-in panel instead of a blank
 * or broken screen — no hard redirect, so they keep the app shell around them.
 */
export function RequireAuth({
  title = "Sign in to continue",
  message,
  children,
}: {
  title?: string;
  message?: string;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-6 w-6 animate-spin border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 flex h-12 w-12 items-center justify-center hairline">
          <Lock size={20} className="text-accent" />
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-muted">
          {message ??
            "Create a free account or sign in to unlock this part of Eureka."}
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex h-[46px] items-center justify-center gap-2 bg-accent px-6 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
          >
            Create account
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-[46px] items-center justify-center hairline px-6 font-mono text-sm uppercase tracking-wider text-muted transition duration-fast hover:border-accent"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
