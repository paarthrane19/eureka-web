"use client";

import Link from "next/link";

import { CuriosityConstellation } from "@/components/landing/CuriosityConstellation";
import { Logo } from "@/components/Logo";
import { ScanLine } from "@/components/ScanLine";

export function AuthScaffold({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-bg text-text">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <CuriosityConstellation />
      </div>

      <header className="px-5 pt-6">
        <Link href="/" className="inline-flex items-center">
          <Logo className="h-8 w-auto" priority />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm bg-surface/80 hairline p-8 backdrop-blur-sm">
          <div className="mb-6">
            <ScanLine className="mb-5 w-14" height={2} />
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-1 font-sans text-sm text-muted">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 hairline-t pt-4 text-center font-mono text-2xs uppercase tracking-wider text-faint">
            {footer}
          </div>
        </div>
      </main>
    </div>
  );
}

export function AuthField({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
        {label}
      </span>
      <input
        {...rest}
        className="h-[48px] w-full hairline bg-surface px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
      />
    </label>
  );
}
