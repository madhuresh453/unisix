"use client";

import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Radar, ServerCog, ShieldCheck, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-0 hacker-grid opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0a0a_0%,rgba(10,10,10,0.84)_44%,rgba(10,10,10,0.56)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-70" />
      <div className="relative grid w-full min-h-[calc(100vh-5rem)] items-center gap-10 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          <Badge>Live cyber range</Badge>
          <h1 className="glitch mt-6 w-full text-balance font-display text-5xl font-black uppercase leading-[0.95] md:text-7xl lg:text-8xl">
            Hack. Learn. Compete. Grow.
          </h1>
          <p className="mt-6 w-full text-lg leading-8 text-cyber-muted md:text-xl">
            UNI6CTF brings competitive events, practice challenges, live rankings, writeups, and team operations into one hacker-first command center.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/auth/register" icon={ShieldCheck}>
              Join CTF
            </Button>
            <Button href="/ctf" variant="secondary" icon={ArrowRight}>
              Explore Events
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">
            <span className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-cyber-red" />
              Socket.io live scoreboard
            </span>
            <span className="h-1 w-1 rounded-full bg-cyber-red" />
            <span>JWT auth</span>
            <span className="h-1 w-1 rounded-full bg-cyber-red" />
            <span>MongoDB challenge engine</span>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, ease: "easeOut", delay: 0.12 }}
          className="scanline cyber-panel relative hidden min-h-[520px] overflow-hidden rounded-xl p-5 lg:block"
        >
          <div className="terminal-grid absolute inset-0 opacity-35" />
          <div className="relative grid gap-4">
            <div className="flex items-center justify-between rounded-xl border border-cyber-red/30 bg-cyber-red/10 px-4 py-3 shadow-glow">
              <span className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em]">
                <Terminal className="h-4 w-4 text-cyber-red" />
                Redline Live
              </span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                Online
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["Teams", "268"],
                ["Solves", "1,904"],
                ["Flags/min", "42"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/45 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyber-muted">{label}</p>
                  <p className="mt-2 text-2xl font-black tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-black/45 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em]">
                  <Radar className="h-4 w-4 text-cyber-red" />
                  Score stream
                </span>
                <span className="text-xs text-cyber-muted">socket.io</span>
              </div>
              {[
                ["nullsec labs", "9,280", "100%"],
                ["ByteBreach", "8,870", "86%"],
                ["Packet Pilots", "8,420", "74%"]
              ].map(([name, score, width]) => (
                <div key={name} className="mb-4 last:mb-0">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-bold">{name}</span>
                    <span className="text-cyber-muted">{score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-cyber-red shadow-glow"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/45 p-4">
                <LockKeyhole className="h-5 w-5 text-cyber-red" />
                <p className="mt-4 text-sm font-black uppercase">Flag validation</p>
                <p className="mt-2 text-sm text-cyber-muted">Timing-safe HMAC checks</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/45 p-4">
                <ServerCog className="h-5 w-5 text-cyber-red" />
                <p className="mt-4 text-sm font-black uppercase">Anti-cheat</p>
                <p className="mt-2 text-sm text-cyber-muted">Velocity and risk scoring</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
