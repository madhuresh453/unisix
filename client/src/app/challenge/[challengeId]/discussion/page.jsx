import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { challenges } from "@/utils/constants";

export default async function ChallengeDiscussionPage({ params }) {
  const { challengeId } = await params;
  const challenge = challenges.find((item) => item.id === challengeId);

  if (!challenge) notFound();

  return (
    <PageShell className="grid gap-6">
      <SectionHeader eyebrow="Discussion" title={challenge.title} />
      <div className="grid gap-3">
        {challenge.discussions.map((item) => (
          <Card key={`${item.author}-${item.time}`}>
            <p className="font-bold uppercase">{item.author}</p>
            <p className="mt-3 leading-7 text-cyber-muted">{item.body}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-cyber-muted">{item.time}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
