"use client";

import { useEffect, useState } from "react";
import { getLiveActivity } from "@/services/engagementService";
import { useSocket } from "@/hooks/useSocket";

export default function LiveActivityPanel() {
  const { socket } = useSocket();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getLiveActivity("limit=12");
        if (!active) return;
        setItems(data.items || []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("activity:join");
    const onNew = (item) => {
      setItems((prev) => [item, ...prev].slice(0, 20));
    };
    socket.on("activity:new", onNew);
    return () => {
      socket.emit("activity:leave");
      socket.off("activity:new", onNew);
    };
  }, [socket]);

  if (loading) return <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-black/30" />;

  return (
    <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Live Platform Activity</h3>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? <p className="text-sm text-cyber-muted">No live activity.</p> : null}
        {items.map((item) => (
          <p key={item._id} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-cyber-muted">{item.text}</p>
        ))}
      </div>
    </section>
  );
}
