import Image from "next/image";
import { ArrowRight, Globe2 } from "lucide-react";

export function SponsorsHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505]/90 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/uni6ctf-hero.png"
          alt="Hacker team in cyber security command"
          fill
          className="object-cover object-right"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.78)_38%,rgba(5,5,5,0.3)_72%,rgba(5,5,5,0.85)_100%)]" />
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_left,rgba(255,0,55,0.18),transparent_40%)]" />
      </div>

      <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:px-12 lg:py-12 xl:px-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyber-muted">Home &gt; Sponsors</p>
          <span className="mt-4 inline-flex items-center rounded-full border border-cyber-red/25 bg-cyber-red/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-cyber-red">
            SPONSORS
          </span>
          <h1 className="mt-8 font-teko text-[68px] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-[82px] lg:text-[96px] xl:text-[108px]">
            OUR <span className="text-cyber-red text-red-glow">SPONSORS</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#f8fafbcc] sm:text-lg">
            Discover the elite partners fueling UNI6CTF’s global cybersecurity events, research programs, and competitive intelligence network.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm uppercase tracking-[0.24em] text-cyber-muted shadow-[0_0_20px_rgba(255,0,0,0.08)]">
              <Globe2 className="h-4 w-4 text-cyber-red" />
              Global sponsorship ecosystem
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm uppercase tracking-[0.24em] text-cyber-muted shadow-[0_0_20px_rgba(255,0,0,0.08)]">
              <ArrowRight className="h-4 w-4 text-cyber-red" />
              Tactical brand alignment
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0b0b]/90 p-6 text-white shadow-glow lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,0,55,0.14)_25%,transparent_60%,rgba(255,0,55,0.08)_100%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#050505]/85 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyber-red">Command Hub</p>
              <h2 className="mt-4 text-3xl font-teko font-black uppercase leading-tight text-white">Premium sponsor showcase</h2>
              <p className="mt-4 text-sm leading-6 text-cyber-muted">A curated portfolio of trusted cybersecurity brands, technology leaders, and strategic event partners.</p>
            </div>
            <div className="grid gap-4">
              {[
                { title: "Brand impact", value: "Industry-leading" },
                { title: "Partner reach", value: "Global" },
                { title: "Activation", value: "High velocity" }
              ].map((item) => (
                <div key={item.title} className="glass rounded-[24px] border border-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyber-muted">{item.title}</p>
                  <p className="mt-3 text-lg font-black uppercase tracking-[0.02em] text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
