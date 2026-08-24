"use client";

import {
  Compass,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Moon,
  PenLine,
  Sun,
  User as UserIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
import { useAuthPrompt } from "@/lib/auth-prompt";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Feed", href: "/app", icon: Zap },
  { label: "Explore", href: "/app/explore", icon: Compass },
  { label: "Chat", href: "/app/chat", icon: MessageSquare },
  { label: "Profile", href: "/app/profile", icon: UserIcon },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { prompt } = useAuthPrompt();
  const { isDark, toggle } = useTheme();

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col hairline-r px-4 py-6 md:flex">
      <Link href="/app" className="mb-8 flex items-center px-2">
        <Logo className="h-9 w-auto" priority />
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 font-sans text-[15px] transition duration-fast",
                active ? "text-text" : "text-muted hover:text-text",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-accent" />
              )}
              <item.icon
                size={18}
                className={active ? "text-accent" : undefined}
              />
              <span className={active ? "font-medium" : undefined}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {user ? (
        <Link
          href="/app/compose"
          className="mt-6 inline-flex h-[46px] items-center justify-center gap-2 bg-accent px-4 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
        >
          <PenLine size={16} />
          Compose
        </Link>
      ) : (
        <button
          onClick={() => prompt({ message: "Sign in to share a discovery." })}
          className="mt-6 inline-flex h-[46px] items-center justify-center gap-2 bg-accent px-4 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
        >
          <PenLine size={16} />
          Compose
        </button>
      )}

      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-muted transition duration-fast hover:text-text"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>

        {user ? (
          <>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-muted transition duration-fast hover:text-heart"
            >
              <LogOut size={16} />
              Log out
            </button>
            <Link
              href="/app/profile"
              className="mt-2 flex items-center gap-2.5 hairline-t px-2 pt-4"
            >
              <Avatar name={user.name} color={user.avatar_color} size={32} />
              <span className="min-w-0">
                <span className="block truncate font-sans text-sm font-medium text-text">
                  {user.name}
                </span>
                <span className="block truncate font-mono text-2xs text-faint">
                  {user.email}
                </span>
              </span>
            </Link>
          </>
        ) : (
          <div className="mt-2 flex flex-col gap-2 hairline-t px-1 pt-4">
            <Link
              href="/login"
              className="flex h-9 items-center justify-center hairline font-mono text-2xs uppercase tracking-wider text-muted transition duration-fast hover:border-accent"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex h-9 items-center justify-center bg-accent font-mono text-2xs font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
