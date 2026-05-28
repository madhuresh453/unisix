"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Brain, CreditCard, Flame, FlaskConical, ScrollText, Shield, Trophy, Users, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiFetch } from "@/services/api";
import LiveActivityPanel from "@/components/dashboard/LiveActivityPanel";
import { getGamificationState } from "@/services/engagementService";

const iconMap = {
  enrolled: Users,
  completed: Trophy,
  activeLabs: FlaskConical,
  completedRooms: Shield,
  certificates: ScrollText,
  purchases: CreditCard,
  streak: Flame,
  xp: Award
};

const sectionMap = {
  learning: "all",
  courses: "course",
  labs: "lab",
  rooms: "room",
  workshops: "workshop",
  certificates: "certificates",
  progress: "progress",
  subscriptions: "subscriptions",
  payments: "payments",
  bookmarks: "bookmarks"
};

export default function AcademyDashboard({ section = "learning" }) {
  const [data, setData] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const payload = await apiFetch("/learning/me/dashboard");
        const g = await getGamificationState().catch(() => null);
        if (active) setData(payload);
        if (active) setGamification(g);
      } catch (err) {
        if (active) setError(err.message || "Failed to load dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const focus = sectionMap[section] || "all";

  const enrollments = useMemo(() => {
    const all = data?.enrollments || [];
    if (focus === "all") return all;
    if (focus === "certificates") return [];
    if (focus === "subscriptions") return [];
    if (focus === "payments") return [];
    if (focus === "bookmarks") return all.filter((x) => (x.bookmarks || []).length);
    return all.filter((x) => x.contentType === focus);
  }, [data, focus]);

  const chartData = useMemo(() => {
    const base = data?.enrollments || [];
    const groups = ["lab", "room", "course", "workshop"].map((key) => {
      const rows = base.filter((x) => x.contentType === key);
      const avg = rows.length ? Math.round(rows.reduce((sum, x) => sum + Number(x.progress || 0), 0) / rows.length) : 0;
      return { name: key.toUpperCase(), progress: avg, completed: rows.filter((x) => x.completed).length };
    });
    return groups;
  }, [data]);

  if (loading) {
    return <main className="grid gap-4 text-white"><div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-black/30" /><div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-black/30" /></main>;
  }

  if (error) {
    return <main className="rounded-2xl border border-cyber-red/30 bg-cyber-red/10 p-6 text-white">{error}</main>;
  }

  const stats = data?.stats || {};
  const statEntries = Object.entries(stats).slice(0, 8);

  return (
    <main className="grid gap-6 text-white">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.2),rgba(5,5,5,0.95)_45%)] p-6 shadow-[0_0_55px_rgba(255,0,60,0.18)]">
        <p className="text-xs uppercase tracking-[0.12em] text-cyber-red">Mission Control</p>
        <h1 className="mt-2 text-3xl font-black uppercase">Learning Command Center</h1>
        <p className="mt-2 text-sm text-cyber-muted">Track labs, rooms, courses, workshops, certificates and premium growth in one realtime cockpit.</p>
        {gamification ? <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyber-red">Level {gamification.level} · {gamification.rank} · XP {gamification.xp}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statEntries.map(([key, value], idx) => {
          const Icon = iconMap[key] || Brain;
          return (
            <motion.article key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">{key}</p><Icon className="h-4 w-4 text-cyber-red" /></div>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Weekly Progress</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ background: "#090909", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
                <Area type="monotone" dataKey="progress" stroke="#ff003c" fill="url(#xpFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Category Mastery</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#fff", fontSize: 11 }} />
                <Radar dataKey="progress" stroke="#ff003c" fill="#ff003c" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Continue Learning</h3>
          <div className="mt-3 grid gap-2">
            {enrollments.slice(0, 6).map((row) => (
              <div key={row._id} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-cyber-muted">
                <p className="font-bold uppercase text-white">{row.contentType}</p>
                <p className="text-xs">Progress {row.progress}%</p>
              </div>
            ))}
            {enrollments.length === 0 ? <p className="text-sm text-cyber-muted">No enrollment activity yet.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Recent Activity</h3>
          <div className="mt-3 grid gap-2">
            {(data?.recentlyViewed || []).slice(0, 6).map((row) => (
              <div key={row._id} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-cyber-muted">
                <p className="font-bold uppercase text-white">{row.contentType}</p>
                <p className="text-xs">Last viewed: {row.lastViewedAt ? new Date(row.lastViewedAt).toLocaleString() : "n/a"}</p>
              </div>
            ))}
            {(data?.recentlyViewed || []).length === 0 ? <p className="text-sm text-cyber-muted">No recent activity.</p> : null}
          </div>
        </div>
      </section>

      <LiveActivityPanel />
    </main>
  );
}
