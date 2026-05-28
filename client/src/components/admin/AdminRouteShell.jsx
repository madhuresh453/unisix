"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AdminRouteShell({ title, children }) {
  const router = useRouter();
  const { loading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading || !isAuthenticated) {
    return <main className="mx-auto max-w-7xl px-6 py-10 text-white">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-white">
      <h1 className="text-3xl font-black uppercase">{title}</h1>
      <div className="mt-6">{children}</div>
    </main>
  );
}
