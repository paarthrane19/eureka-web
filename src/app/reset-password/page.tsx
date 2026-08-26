"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthField, AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/Button";
import { api, ApiError } from "@/lib/api";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="font-mono text-2xs uppercase tracking-wide text-heart">
        This reset link is missing its token. Request a new one below.
      </p>
    );
  }

  if (done) {
    return (
      <p className="font-sans text-sm text-text">
        Your password has been reset. You can now{" "}
        <Link href="/login" className="text-accentInk hover:brightness-110">
          sign in
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <AuthField
        label="New password"
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      <AuthField
        label="Confirm password"
        type="password"
        required
        minLength={6}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
      />
      {error && (
        <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Reset password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthScaffold
      title="Set a new password"
      subtitle="Choose something you haven't used before."
      footer={
        <>
          Need a new link?{" "}
          <Link
            href="/forgot-password"
            className="text-accentInk hover:brightness-110"
          >
            Request another
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthScaffold>
  );
}
