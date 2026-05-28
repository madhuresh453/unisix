"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn({ email, password });

      if (!result?.user?.adminAccess) {
        throw new Error("Admin access required.");
      }

      router.push("/admin/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-white">
      <h1 className="text-3xl font-black uppercase">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Admin email"
          className="min-h-12 rounded-md border border-white/20 bg-black/40 px-4"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="min-h-12 rounded-md border border-white/20 bg-black/40 px-4"
          required
        />
        {error ? <p className="text-sm text-cyber-red">{error}</p> : null}
        <button type="submit" disabled={loading} className="min-h-12 rounded-md bg-cyber-red px-4 font-bold uppercase">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
