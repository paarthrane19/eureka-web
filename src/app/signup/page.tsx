"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthField, AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(email.trim(), password, name.trim());
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up.");
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Join Eureka"
      subtitle="Curiosity is the only requirement."
      footer={
        <>
          Already a member?{" "}
          <Link href="/login" className="text-accent hover:brightness-110">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <AuthField
          label="Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
        />
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        {error && (
          <p className="mb-3 font-mono text-2xs uppercase tracking-wide text-heart">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Create account
          <ArrowRight size={16} />
        </Button>
      </form>
    </AuthScaffold>
  );
}
