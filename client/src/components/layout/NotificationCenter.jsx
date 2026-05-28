"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getMyNotifications, readAllNotifications, readNotification } from "@/services/engagementService";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/helpers";

export function NotificationCenter() {
  const { socket } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!isAuthenticated) return;
      try {
        const data = await getMyNotifications("limit=20");
        if (!active) return;
        setItems(data.items || []);
        setUnread(data.unread || 0);
      } catch {
        if (!active) return;
        setItems([]);
        setUnread(0);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket || !user?.id) return;
    socket.emit("notifications:join", { userId: user.id });

    const onNew = (notification) => {
      setItems((prev) => [notification, ...prev].slice(0, 30));
      setUnread((prev) => prev + 1);
    };
    socket.on("notification:new", onNew);

    return () => {
      socket.emit("notifications:leave", { userId: user.id });
      socket.off("notification:new", onNew);
    };
  }, [socket, user?.id]);

  const sorted = useMemo(() => [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)), [items]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/[0.12] bg-white/[0.02] text-white transition-all duration-300 hover:border-cyber-red/50 hover:text-cyber-red"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-cyber-red px-1.5 text-[10px] font-black text-white">{Math.min(unread, 99)}</span> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[52px] z-[999] w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#050505]/98 p-3 shadow-[0_0_45px_rgba(255,0,60,0.2)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-cyber-red">Notifications</p>
            <button
              type="button"
              onClick={async () => {
                await readAllNotifications().catch(() => null);
                setUnread(0);
                setItems((prev) => prev.map((x) => ({ ...x, readAt: x.readAt || new Date().toISOString() })));
              }}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-cyber-muted hover:text-cyber-red"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Read all
            </button>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
            {sorted.length === 0 ? <p className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-cyber-muted">No notifications yet.</p> : null}
            {sorted.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={async () => {
                  if (!item.readAt) {
                    await readNotification(item._id).catch(() => null);
                    setUnread((prev) => Math.max(0, prev - 1));
                    setItems((prev) => prev.map((x) => (x._id === item._id ? { ...x, readAt: new Date().toISOString() } : x)));
                  }
                  if (item.actionUrl) window.location.assign(item.actionUrl);
                }}
                className={cn("w-full rounded-xl border p-3 text-left transition-all duration-300", item.readAt ? "border-white/10 bg-black/25" : "border-cyber-red/30 bg-cyber-red/10")}
              >
                <p className="text-[11px] font-black uppercase tracking-[0.11em] text-white">{item.title}</p>
                <p className="mt-1 text-xs text-cyber-muted">{item.message}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
