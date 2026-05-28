"use client";

import { useEffect, useState } from "react";
import { listMentors } from "@/services/pathMentorService";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listMentors("verified=true&limit=50").then((x) => setItems(x.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black uppercase">Mentors</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="text-xs uppercase tracking-[0.11em] text-cyber-red">{item.verified ? "Verified Mentor" : "Mentor"}</p>
            <h2 className="mt-2 text-xl font-black uppercase">{item.userId?.name || item.userId?.handle || "Mentor"}</h2>
            <p className="mt-2 text-sm text-cyber-muted">{item.headline || item.bio || "Cybersecurity mentor profile."}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
