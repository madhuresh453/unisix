import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { challenges } from "@/utils/constants";

export default async function ChallengeSolversPage({ params }) {
  const { challengeId } = await params;
  const challenge = challenges.find((item) => item.id === challengeId);

  if (!challenge) notFound();

  return (
    <PageShell className="grid gap-6">
      <SectionHeader eyebrow="Solvers" title={challenge.title} />
      <div className="grid gap-3 md:grid-cols-2">
        {challenge.solvers.map((solver, index) => (
          <Card key={solver} glow>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">Rank #{index + 1}</p>
            <p className="mt-2 text-xl font-black uppercase">{solver}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
