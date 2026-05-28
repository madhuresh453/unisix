"use client";

import { useEffect, useState } from "react";
import { getLearningPath } from "@/services/pathMentorService";

export default function Page({ params }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    getLearningPath(params.slug).then((x) => setItem(x.item || null)).catch(() => setItem(null));
  }, [params.slug]);

  if (!item) return <main className="mx-auto max-w-7xl px-4 py-10 text-white">Path not found.</main>;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black uppercase">{item.title}</h1>
      <p className="mt-3 text-sm text-cyber-muted">{item.description}</p>
      <div className="mt-6 grid gap-3">
        {(item.nodes || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((n) => (
          <div key={`${n.title}-${n.order}`} className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
            <p className="font-black uppercase text-cyber-red">{n.type}</p>
            <p className="mt-1 text-white">{n.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
