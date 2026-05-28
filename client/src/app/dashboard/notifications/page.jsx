"use client";

import { useEffect, useState } from "react";
import { getMyNotifications, readAllNotifications, readNotification } from "@/services/engagementService";

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getMyNotifications("limit=100").catch(() => ({ items: [] }));
      if (active) {
        setItems(data.items || []);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <main className="h-48 animate-pulse rounded-2xl border border-white/10 bg-black/30" />;

  return (
    <main className="rounded-2xl border border-white/10 bg-black/35 p-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black uppercase">Notification History</h1>
        <button
          type="button"
          onClick={async () => {
            await readAllNotifications().catch(() => null);
            setItems((prev) => prev.map((x) => ({ ...x, readAt: x.readAt || new Date().toISOString() })));
          }}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-cyber-muted hover:text-cyber-red"
        >
          Mark All Read
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {items.length === 0 ? <p className="text-sm text-cyber-muted">No notifications found.</p> : null}
        {items.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={async () => {
              if (!item.readAt) {
                await readNotification(item._id).catch(() => null);
                setItems((prev) => prev.map((x) => (x._id === item._id ? { ...x, readAt: new Date().toISOString() } : x)));
              }
            }}
            className={`rounded-xl border p-3 text-left ${item.readAt ? "border-white/10 bg-black/30" : "border-cyber-red/30 bg-cyber-red/10"}`}
          >
            <p className="text-xs font-black uppercase tracking-[0.1em]">{item.title}</p>
            <p className="mt-1 text-sm text-cyber-muted">{item.message}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
