"use client";

import { motion } from "framer-motion";
import { Clock3, Lock, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { apiFetch } from "@/services/api";

function hasPremium(user) {
  const plan = String(user?.subscriptionPlan || "free").toLowerCase();
  return ["premium", "pro", "enterprise"].includes(plan);
}

function PriceBadge({ item }) {
  if (!item?.premium) return <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-emerald-300">Free</span>;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyber-red/40 bg-cyber-red/10 px-3 py-1 text-cyber-red">
      {item.offerPrice ? <strong>Rs {item.offerPrice}</strong> : null}
      <span className={item.offerPrice ? "text-white/40 line-through" : ""}>Rs {item.price || 0}</span>
      {item.offerPercentage ? <span>{item.offerPercentage}% off</span> : null}
      {item.offer?.enabled ? <span className="text-cyber-muted">Countdown soon</span> : null}
    </span>
  );
}

export default function LearningDetailExperience({ item, type }) {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [liveUsers, setLiveUsers] = useState(Number(item?.activeUsers || 0));
  const [fullItem, setFullItem] = useState(item);
  const [loadingFull, setLoadingFull] = useState(false);

  const lockedByAuth = !isAuthenticated;
  const lockedByPremium = Boolean(item?.premium) && !hasPremium(user);
  const locked = lockedByAuth || lockedByPremium;

  useEffect(() => {
    if (!socket || !item?._id) return;
    socket.emit("learning:join", { scope: type.slice(0, -1), id: item._id });
    const onProgress = (payload) => {
      if (payload?.id === item._id && Number.isFinite(payload.activeUsers)) {
        setLiveUsers(payload.activeUsers);
      }
    };
    socket.on("learning:progress:update", onProgress);
    return () => {
      socket.emit("learning:leave", { scope: type.slice(0, -1), id: item._id });
      socket.off("learning:progress:update", onProgress);
    };
  }, [socket, item?._id, type]);

  useEffect(() => {
    let active = true;
    async function loadFull() {
      if (!isAuthenticated || !item?._id || locked) return;
      try {
        setLoadingFull(true);
        const data = await apiFetch(`/learning/${type}/${item._id}/full`);
        if (active && data?.item) setFullItem(data.item);
      } catch {
        if (active) setFullItem(item);
      } finally {
        if (active) setLoadingFull(false);
      }
    }
    loadFull();
    return () => {
      active = false;
    };
  }, [isAuthenticated, item, locked, type]);

  const details = useMemo(() => fullItem || item, [fullItem, item]);

  if (!item) {
    return <main className="mx-auto max-w-7xl px-4 py-16 text-white">Content not found.</main>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-7 shadow-[0_0_60px_rgba(255,0,60,0.18)]">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <p className="text-xs uppercase tracking-[0.13em] text-cyber-red">{type.slice(0, -1)}</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.05em]">{item.title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-cyber-muted">{item.description || item.storyline || ""}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/20 px-3 py-1">{item.difficulty || item.category || "general"}</span>
          <span className="rounded-full border border-white/20 px-3 py-1">{item.premium ? "Premium" : "Free"}</span>
          <PriceBadge item={item} />
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1"><Users className="h-3.5 w-3.5" /> {liveUsers}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1"><Clock3 className="h-3.5 w-3.5" /> {item.estimatedTime || item.duration || 60}m</span>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
          <h2 className="text-lg font-black uppercase tracking-[0.08em]">Objectives</h2>
          <ul className="mt-3 grid gap-2 text-sm text-cyber-muted">
            {(details?.objectives?.length ? details.objectives : ["Hands-on security workflow", "Exploit and defense strategy", "Practical reporting output"]).map((objective) => (
              <li key={objective} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">{objective}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm font-black uppercase tracking-[0.1em] text-cyber-red">Walkthrough</h3>
          <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-cyber-muted">
            {loadingFull ? "Syncing full content..." : details?.walkthrough || details?.writeup || "Walkthrough available after unlock."}
          </div>

          {locked ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-2xl border border-cyber-red/30 bg-black/80 backdrop-blur-sm">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Lock className="h-8 w-8 text-cyber-red" />
                <p className="mt-3 text-lg font-black uppercase">{lockedByAuth ? "Login Required" : "Premium Locked"}</p>
                <p className="mt-2 text-sm text-cyber-muted">{lockedByAuth ? "Sign in to access learning content and enrollments." : "Upgrade subscription to unlock advanced content."}</p>
                <a href={lockedByAuth ? "/auth/login" : "/dashboard/subscriptions"} className="mt-4 rounded-xl bg-cyber-red px-4 py-2 text-xs font-black uppercase tracking-[0.11em] text-white">
                  {lockedByAuth ? "Login" : "Upgrade"}
                </a>
              </div>
            </motion.div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <h2 className="text-lg font-black uppercase tracking-[0.08em]">Session Telemetry</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["Live Participants", liveUsers],
              ["Completion Rate", `${Math.min(100, (details?.enrolledUsers?.length || 0) * 7)}%`],
              ["XP Reward", details?.points || 250],
              ["Access", details?.premium ? "Premium" : "Open"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.12em] text-cyber-muted">{label}</p>
                <p className="mt-1 text-lg font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-cyber-red/30 bg-cyber-red/10 p-3 text-xs text-cyber-muted">
            <p className="inline-flex items-center gap-2 font-black uppercase tracking-[0.1em] text-cyber-red"><ShieldCheck className="h-4 w-4" /> Live Protected Session</p>
            <p className="mt-2">Realtime presence, progress sync and locked content controls are enabled for this module.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
