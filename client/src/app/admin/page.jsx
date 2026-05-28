"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminIndexPage() {
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
      return;
    }
    router.replace("/admin/dashboard");
  }, [loading, isAuthenticated, isAdmin]);

  return <main className="mx-auto max-w-7xl px-6 py-10 text-white">Loading...</main>;
}
