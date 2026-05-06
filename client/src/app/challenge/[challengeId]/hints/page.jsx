import { notFound } from "next/navigation";
import { HintUnlockList } from "@/components/challenge/HintUnlockList";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { challenges } from "@/utils/constants";

export default async function ChallengeHintsPage({ params }) {
  const { challengeId } = await params;
  const challenge = challenges.find((item) => item.id === challengeId);

  if (!challenge) notFound();

  return (
    <PageShell className="grid gap-6">
      <SectionHeader eyebrow="Hints" title={challenge.title} />
      <Card>
        <HintUnlockList hints={challenge.hints} />
      </Card>
    </PageShell>
  );
}
