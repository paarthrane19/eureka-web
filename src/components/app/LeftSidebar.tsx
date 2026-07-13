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
import { usePathname, useRouter } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
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
  const router = useRouter();
  const { user, logout } = useAuth();
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

      <Link
        href="/app/compose"
        className="mt-6 inline-flex h-[46px] items-center justify-center gap-2 bg-accent px-4 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105"
      >
        <PenLine size={16} />
        Compose
      </Link>

      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-muted transition duration-fast hover:text-text"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-muted transition duration-fast hover:text-heart"
        >
          <LogOut size={16} />
          Log out
        </button>

        {user && (
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
        )}
      </div>
    </aside>
  );
}
