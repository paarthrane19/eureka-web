"use client";

import { Compass, MessageSquare, PenLine, User as UserIcon, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthPrompt } from "@/lib/auth-prompt";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Zap;
  exact?: boolean;
};

const LEFT: NavItem[] = [
  { label: "Feed", href: "/app", icon: Zap, exact: true },
  { label: "Explore", href: "/app/explore", icon: Compass },
];

// Chat and Profile require an account. Signed-out visitors are routed to the
// sign-in prompt instead of a dead page (see BottomNav below).
const RIGHT: NavItem[] = [
  { label: "Chat", href: "/app/chat", icon: MessageSquare },
  { label: "Profile", href: "/app/profile", icon: UserIcon },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
}

function Tab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Zap;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 transition duration-fast",
        active ? "text-accent" : "text-faint hover:text-muted",
      )}
    >
      <Icon size={20} />
      <span className="font-mono text-[10px] uppercase tracking-wider">
        {label}
      </span>
    </Link>
  );
}

// Mobile-only bottom navigation. Hidden at md+ where the LeftSidebar takes over.
// Compose sits in the center as a raised accent action (FAB-style).
export function BottomNav() {
  const isActive = useActive();
  const { user } = useAuth();
  const { prompt } = useAuthPrompt();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around hairline-t bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      {LEFT.map((item) => (
        <Tab
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={isActive(item.href, item.exact)}
        />
      ))}

      {user ? (
        <Link
          href="/app/compose"
          aria-label="Compose"
          className="flex min-h-[56px] flex-1 items-center justify-center"
        >
          <span className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-accent text-accentText shadow-lg transition duration-fast hover:brightness-105">
            <PenLine size={22} />
          </span>
        </Link>
      ) : (
        <button
          aria-label="Compose"
          onClick={() => prompt({ message: "Sign in to share a discovery." })}
          className="flex min-h-[56px] flex-1 items-center justify-center"
        >
          <span className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-accent text-accentText shadow-lg transition duration-fast hover:brightness-105">
            <PenLine size={22} />
          </span>
        </button>
      )}

      {RIGHT.map((item) =>
        user ? (
          <Tab
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.href, item.exact)}
          />
        ) : (
          <button
            key={item.href}
            onClick={() =>
              prompt({ message: `Sign in to use ${item.label.toLowerCase()}.` })
            }
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-faint transition duration-fast hover:text-muted"
          >
            <item.icon size={20} />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        ),
      )}
    </nav>
  );
}
