import { CalendarDays, Code2, Globe2, ShieldCheck, Users } from "lucide-react";

const stats = [
  { label: "Team Members", value: "10+", icon: Users },
  { label: "Developers", value: "2+", icon: Code2 },
  { label: "Security Researchers", value: "3+", icon: ShieldCheck },
  { label: "Events Organized", value: "4+", icon: CalendarDays },
  { label: "Countries Reached", value: "15+", icon: Globe2 }
];

export function TeamStats() {
  return (
    <section className="grid gap-4 rounded-[28px] border border-white/10 bg-[#080808]/95 p-5 shadow-[0_0_40px_rgba(255,0,0,0.06)] sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group flex flex-col rounded-3xl border border-white/10 bg-[#0b0b0b]/90 p-5 transition duration-300 hover:border-cyber-red/40 hover:shadow-glow-card"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-red/20 bg-black/40 text-cyber-red shadow-[0_0_22px_rgba(255,0,0,0.12)]">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-5 font-teko text-3xl font-black uppercase tracking-[-0.04em] text-white">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-cyber-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
