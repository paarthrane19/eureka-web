"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function WaitlistForm({
  onCount,
  className,
}: {
  onCount?: (n: number) => void;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    setError("");
    try {
      const res = await api.joinWaitlist(email.trim());
      onCount?.(res.count);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 hairline bg-accentSoft",
          className,
        )}
      >
        <Check size={20} className="text-accent" />
        <span className="font-mono text-sm uppercase tracking-wide text-text">
          You&apos;re on the list. We&apos;ll be in touch.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@curious.mind"
          className="h-[52px] flex-1 hairline bg-surface px-4 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex h-[52px] items-center justify-center gap-2 bg-accent px-6 font-mono text-[15px] font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
        >
          {state === "loading" ? (
            <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
          ) : (
            <>
              Join the waitlist
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 font-mono text-2xs uppercase tracking-wide text-heart">
          {error}
        </p>
      )}
    </form>
  );
}
