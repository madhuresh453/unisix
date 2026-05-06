"use client";
import Link from "next/link";
import Image from "next/image";

export function TeamHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]">
      <div className="absolute inset-0 -z-10 opacity-90">
        <Image
          src="/images/uni6ctf-hero.png"
          alt="Cyber operations command background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.75)_38%,rgba(5,5,5,0.35)_70%,rgba(5,5,5,0.82)_100%)]" />
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle at left, rgba(255,0,55,0.18), transparent 40%)"
          }}
        />
      </div>

      <div className="absolute inset-0 bg-cyber-bg/80" />
      <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-40" />

      <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:px-12 lg:py-14 xl:px-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyber-muted">Home &gt; Team</p>
          <span className="mt-4 inline-flex items-center rounded-full border border-cyber-red/25 bg-cyber-red/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-cyber-red">
            TEAM
          </span>
          <h1 className="mt-8 max-w-[14ch] font-teko text-[64px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-[74px] lg:text-[96px] xl:text-[110px]">
            THE MINDS BEHIND <span className="text-cyber-red">UNI6CTF</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#e5e7ebcc] sm:text-lg">
            A tactical cyber warfare collective built for elite operators, research architects, and global event crews. We move with precision, execute at scale, and deliver world-class security operations.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Advanced offense", value: "24/7", detail: "Mission cadence" },
              { label: "Red team ops", value: "5.2x", detail: "Threat velocity" },
              { label: "Global reach", value: "25+", detail: "Countries activated" }
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-[24px] border border-white/10 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="text-sm uppercase tracking-[0.28em] text-cyber-muted">{stat.label}</p>
                <p className="mt-3 text-3xl font-teko font-black uppercase tracking-[-0.04em] text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-cyber-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden rounded-[32px] border border-cyber-red/20 bg-[#090909]/40 p-6 shadow-glow lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,0,55,0.12)_20%,transparent_48%,rgba(255,0,55,0.08)_100%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#050505]/90 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyber-red">COMMAND SYNDICATE</p>
              <h2 className="mt-4 font-teko text-3xl font-black uppercase leading-tight text-white">Cinematic threat operations HQ</h2>
              <p className="mt-4 text-sm leading-6 text-cyber-muted">A covert ensemble of developers, security researchers, and elite organizers powering every UNI6CTF mission.</p>
            </div>
            <div className="grid gap-4">
              {[
                { label: "ISO aligned", value: "Tactical" },
                { label: "Ops maturity", value: "Enterprise" },
                { label: "Performance", value: "Premium" }
              ].map((item) => (
                <div key={item.label} className="glass flex items-center justify-between gap-4 rounded-[22px] border border-white/10 px-4 py-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyber-muted">{item.label}</p>
                  <span className="font-teko text-xl font-black uppercase text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
