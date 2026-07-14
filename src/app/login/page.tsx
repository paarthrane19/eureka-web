"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthField, AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Welcome back"
      subtitle="Sign in to keep going deeper."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-accentInk hover:brightness-110">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <AuthField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@curious.mind"
        />
        <AuthField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && (
          <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Sign in
          <ArrowRight size={16} />
        </Button>
      </form>
    </AuthScaffold>
  );
}
