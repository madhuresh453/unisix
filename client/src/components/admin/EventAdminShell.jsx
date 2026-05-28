"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";

export function EventAdminShell({ slug, title, children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        await apiFetch(`/ctf/${slug}/admin`);
        if (active) setLoading(false);
      } catch (err) {
        if (!active) return;
        const message = err?.message || "Forbidden";
        setError(message);
        if (message.toLowerCase().includes("authentication")) {
          router.replace("/admin/login");
        }
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <main className="mx-auto max-w-7xl px-6 py-10 text-white">Loading...</main>;
  }

  if (error) {
    return <main className="mx-auto max-w-7xl px-6 py-10 text-white">{error}</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-white">
      <h1 className="text-3xl font-black uppercase">{title}</h1>
      <div className="mt-6">{children}</div>
    </main>
  );
}
