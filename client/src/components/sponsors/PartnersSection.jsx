import { Button } from "@/components/ui/Button";

const partners = [
  "UNISIX SECURITY",
  "Thunder Cipher",
  "SmartED Innovations",
  "Cyber Hunter Warrior",
  "Cyber Leelawat",
  "HKU Software Community",
  "SUS CC"
];

export function PartnersSection() {
  return (
    <section className="grid gap-8 rounded-[32px] border border-white/10 bg-[#0a0a0a]/95 p-6 shadow-[0_0_40px_rgba(255,0,0,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyber-red">OUR PARTNERS</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-cyber-muted">Partner organizations powering UNI6CTF’s learning networks, conferences, and professional community.</p>
        </div>
        <Button href="/partners" variant="secondary" className="rounded-3xl border-white/10 bg-black/40 text-white hover:border-cyber-red/50 hover:bg-white/[0.04]">
          View All Partners
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {partners.map((partner) => (
          <div key={partner} className="group flex min-h-[100px] items-center justify-center rounded-[28px] border border-white/10 bg-[#050505]/80 px-4 text-center text-sm font-black uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyber-red/35 hover:bg-white/[0.02] hover:shadow-glow">
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}
