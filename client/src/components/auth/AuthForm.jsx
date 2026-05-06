"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function AuthForm({ mode }) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    handle: "",
    email: "",
    password: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await signUp(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cyber-panel w-full rounded-xl p-6 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyber-red">
          {isRegister ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase">
          {isRegister ? "Join UNI6CTF" : "Login"}
        </h1>
      </div>

      <div className="grid gap-4">
        {isRegister ? (
          <>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Full name"
              required
            />
            <Input
              value={form.handle}
              onChange={(event) => updateField("handle", event.target.value)}
              placeholder="Hacker handle"
              required
            />
          </>
        ) : null}
        <Input
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Password"
          required
        />
      </div>

      {error ? <p className="mt-4 text-sm text-cyber-red">{error}</p> : null}

      <Button className="mt-6 w-full" icon={isRegister ? UserPlus : KeyRound} disabled={loading}>
        {loading ? "Processing" : isRegister ? "Register" : "Login"}
      </Button>
    </form>
  );
}
