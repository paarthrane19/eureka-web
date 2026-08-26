"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthField, AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Reset your password"
      subtitle="We'll email you a link to get back in."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-accentInk hover:brightness-110">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <p className="mb-2 font-sans text-sm text-text">
          If that email exists, we&apos;ve sent a reset link. Check your inbox.
        </p>
      ) : (
        <form onSubmit={submit}>
          <AuthField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@curious.mind"
          />
          {error && (
            <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthScaffold>
  );
}
