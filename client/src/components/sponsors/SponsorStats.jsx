import { Award, Globe2, Layers, Sparkles } from "lucide-react";

const stats = [
  { value: "25+", label: "Sponsors", icon: Award },
  { value: "10+", label: "Partners", icon: Layers },
  { value: "40+", label: "Countries Reached", icon: Globe2 },
  { value: "100+", label: "Events Supported", icon: Sparkles }
];

export function SponsorStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a]/90 p-6 shadow-[inset_0_0_24px_rgba(255,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-cyber-red/40 hover:shadow-glow-card" key={stat.label}>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-cyber-red/25 bg-black/40 text-cyber-red shadow-[0_0_22px_rgba(255,0,0,0.12)]">
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-5 font-teko text-3xl font-black uppercase tracking-[-0.04em] text-white">{stat.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-cyber-muted">{stat.label}</p>
          </div>
        );
      })}
    </section>
  );
}
