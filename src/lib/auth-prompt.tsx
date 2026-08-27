"use client";

import { ArrowRight, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./auth";

interface PromptOptions {
  /** Short reason shown above the form, e.g. "Sign in to upvote this". */
  message?: string;
  /** Which panel to open first. Defaults to "signup" (grow the user base). */
  mode?: "login" | "signup";
}

interface AuthPromptCtx {
  /** Open the inline sign-in / sign-up modal. Never navigates the page. */
  prompt: (options?: PromptOptions) => void;
}

const Ctx = createContext<AuthPromptCtx | null>(null);

export function AuthPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const prompt = useCallback((options?: PromptOptions) => {
    setMessage(options?.message);
    setMode(options?.mode ?? "signup");
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ prompt }}>
      {children}
      {open && (
        <AuthPromptModal message={message} initialMode={mode} onClose={close} />
      )}
    </Ctx.Provider>
  );
}

export function useAuthPrompt() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  return ctx;
}

function AuthPromptModal({
  message,
  initialMode,
  onClose,
}: {
  message?: string;
  initialMode: "login" | "signup";
  onClose: () => void;
}) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape, and lock body scroll while open so the page keeps its
  // position underneath (we never navigate away).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password, name.trim());
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === "login"
            ? "Could not sign in."
            : "Could not create your account.",
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm hairline bg-surface p-6 shadow-xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-faint transition duration-fast hover:text-text"
        >
          <X size={16} />
        </button>

        <h2 className="font-display text-2xl font-bold tracking-tight">
          {mode === "login" ? "Welcome back" : "Join Supasift"}
        </h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
          {message ??
            (mode === "login"
              ? "Sign in to keep going deeper."
              : "Create a free account to join the conversation.")}
        </p>

        <form onSubmit={submit} className="mt-5">
          {mode === "signup" && (
            <label className="mb-3 block">
              <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
                Name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="h-[46px] w-full hairline bg-bg px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
              />
            </label>
          )}
          <label className="mb-3 block">
            <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@curious.mind"
              className="h-[46px] w-full hairline bg-bg px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1.5 block font-mono text-2xs uppercase tracking-widest text-faint">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-[46px] w-full hairline bg-bg px-3 font-sans text-[15px] text-text outline-none transition duration-fast placeholder:text-faint focus:border-accent"
            />
          </label>
          {error && (
            <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex h-[48px] w-full items-center justify-center gap-2 bg-accent px-6 font-mono text-sm font-bold uppercase tracking-wider text-accentText transition duration-fast hover:brightness-105 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
            ) : (
              <>
                {mode === "login" ? "Sign in" : "Create account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center font-sans text-sm text-muted">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-accentInk hover:brightness-110"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-accentInk hover:brightness-110"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
