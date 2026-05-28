"use client";

import { motion } from "framer-motion";
import { Lock, Search, ShieldAlert, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const difficultyTone = {
  easy: "text-emerald-400 border-emerald-500/40",
  beginner: "text-emerald-400 border-emerald-500/40",
  medium: "text-yellow-300 border-yellow-400/40",
  intermediate: "text-yellow-300 border-yellow-400/40",
  hard: "text-orange-300 border-orange-400/40",
  advanced: "text-orange-300 border-orange-400/40",
  insane: "text-red-400 border-red-500/40",
  expert: "text-red-400 border-red-500/40"
};

function normalizeDifficulty(value = "") {
  return String(value).toLowerCase();
}

function PriceBlock({ item }) {
  if (!item.premium) return <span className="text-emerald-300">Free</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {item.offerPrice ? <span className="font-black text-cyber-red">Rs {item.offerPrice}</span> : null}
      <span className={item.offerPrice ? "text-white/40 line-through" : "text-white/70"}>Rs {item.price || 0}</span>
      {item.offerPercentage ? <span className="rounded-full border border-cyber-red/40 bg-cyber-red/10 px-2 py-0.5 text-[10px] font-black text-cyber-red">{item.offerPercentage}% off</span> : null}
      {item.offer?.enabled ? <span className="text-[10px] uppercase tracking-[0.1em] text-cyber-muted">Deal timer soon</span> : null}
    </span>
  );
}

export default function LearningExperience({ title, type, items = [] }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [premium, setPremium] = useState("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const d = normalizeDifficulty(item.difficulty);
      if (difficulty !== "all" && d !== difficulty) return false;
      if (premium === "free" && item.premium) return false;
      if (premium === "premium" && !item.premium) return false;
      if (search && !`${item.title} ${item.category || ""} ${(item.tags || []).join(" ")}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [items, search, difficulty, premium]);

  const stats = {
    active: items.filter((x) => x.status === "published").length,
    online: items.reduce((sum, x) => sum + Number(x.activeUsers || 0), 0),
    completions: items.reduce((sum, x) => sum + Number(x.enrolledUsers?.length || 0), 0),
    premium: items.filter((x) => x.premium).length
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.2),rgba(5,5,5,0.95)_45%)] p-7 shadow-[0_0_60px_rgba(255,0,60,0.18)]">
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Cyber Academy</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.05em]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-cyber-muted">Live, premium and hands-on cybersecurity training with realtime telemetry, progression and certification.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Active", stats.active],
            ["Online Users", stats.online],
            ["Completions", stats.completions],
            ["Premium", stats.premium]
          ].map(([label, value], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">{label}</p>
              <p className="mt-1 text-2xl font-black text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3">
            <Search className="h-4 w-4 text-cyber-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${type}`} className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-cyber-muted" />
          </label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm">
            <option value="all">All Difficulty</option>
            <option value="beginner">Easy</option>
            <option value="intermediate">Medium</option>
            <option value="advanced">Hard</option>
            <option value="expert">Insane</option>
          </select>
          <select value={premium} onChange={(e) => setPremium(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm">
            <option value="all">All Access</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
          <div className="flex items-center justify-center rounded-xl border border-cyber-red/30 bg-cyber-red/10 px-3 text-xs font-black uppercase tracking-[0.12em] text-cyber-red">Trending + Featured</div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-cyber-muted">No results found. Try different filters.</div>
        ) : (
          filtered.map((item, idx) => {
            const tone = difficultyTone[normalizeDifficulty(item.difficulty)] || "text-cyber-muted border-white/20";
            const completion = Math.min(100, Math.round((item.enrolledUsers?.length || 0) * 7));
            return (
              <motion.article key={item._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="group rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_0_35px_rgba(255,0,60,0.08)] transition-all duration-300 hover:border-cyber-red/40 hover:shadow-[0_0_45px_rgba(255,0,60,0.2)]">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${tone}`}>{item.difficulty || item.category || "General"}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-cyber-muted"><Users className="h-3.5 w-3.5" />{item.activeUsers || 0}</span>
                </div>
                <h2 className="mt-3 text-xl font-black uppercase">{item.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-cyber-muted">{item.description || item.storyline || "No description."}</p>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-cyber-muted"><span>Completion</span><span>{completion}%</span></div>
                  <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-cyber-red" style={{ width: `${completion}%` }} /></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-cyber-muted"><PriceBlock item={item} /></div>
                  <Link href={`/${type}/${item.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-cyber-red/40 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-cyber-red transition-all duration-300 hover:bg-cyber-red hover:text-white">
                    {item.premium ? <Lock className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {item.premium ? "Unlock" : "Start"}
                  </Link>
                </div>
              </motion.article>
            );
          })
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-center">
        <p className="text-xs uppercase tracking-[0.12em] text-cyber-red">Upgrade</p>
        <h3 className="mt-2 text-2xl font-black uppercase">Unlock Premium Cyber Ranges</h3>
        <p className="mt-2 text-sm text-cyber-muted">Access advanced labs, guided rooms, mentor workshops and certificate tracks.</p>
        <Link href="/dashboard/subscriptions" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyber-red px-5 py-2.5 text-xs font-black uppercase tracking-[0.11em] text-white transition hover:bg-red-600">
          <ShieldAlert className="h-4 w-4" /> Upgrade Plan
        </Link>
      </section>
    </main>
  );
}
