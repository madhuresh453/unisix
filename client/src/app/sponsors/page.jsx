import { PartnersGrid } from "@/components/home/PartnersGrid";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SponsorsPage() {
  return (
    <PageShell className="grid gap-10">
      <SectionHeader
        eyebrow="Sponsors"
        title="Support the next generation of security builders"
        body="Sponsor CTF events, challenge tracks, student travel, cloud infrastructure, and research publication."
      />
      <PartnersGrid />
      <Card glow>
        <h2 className="text-2xl font-black uppercase">Sponsor tracks</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["Event title partner", "Challenge category partner", "Community education partner"].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-bold uppercase">{item}</p>
              <p className="mt-2 text-sm leading-6 text-cyber-muted">
                Brand visibility, judging participation, recruiting access, and impact reporting.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
