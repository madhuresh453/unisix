import { Crown, ShieldCheck } from "lucide-react";

export function SponsorTierCard({ title, tag, detail, accent, logos }) {
  return (
    <div className={`group overflow-hidden rounded-[32px] border ${accent.border} bg-[#0b0b0b]/95 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow-card`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 text-cyber-red shadow-[0_0_24px_rgba(255,0,0,0.14)]">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className={`text-xl font-teko font-black uppercase tracking-[-0.03em] ${accent.text}`}>{title}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-cyber-muted">{detail}</p>
            </div>
          </div>
        </div>
        {tag ? <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] ${accent.tag}`}>{tag}</span> : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#050505]/70 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyber-red/50 hover:shadow-[0_0_18px_rgba(255,0,0,0.15)]">
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${logo.bg}`}>{logo.icon ?? logo.initials}</span>
            <div>
              <p className={`text-sm font-black uppercase tracking-[0.18em] ${logo.text}`}>{logo.name}</p>
              {logo.subtitle ? <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyber-muted">{logo.subtitle}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
