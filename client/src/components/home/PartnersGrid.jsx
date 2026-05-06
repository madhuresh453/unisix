import { partners } from "@/utils/constants";

export function PartnersGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {partners.map((partner) => (
        <div
          key={partner}
          className="grid min-h-24 place-items-center rounded-xl border border-white/10 bg-white/[0.035] px-4 text-center text-sm font-black uppercase tracking-[0.16em] text-cyber-muted transition hover:border-cyber-red/45 hover:text-white hover:shadow-glow"
        >
          {partner}
        </div>
      ))}
    </div>
  );
}
