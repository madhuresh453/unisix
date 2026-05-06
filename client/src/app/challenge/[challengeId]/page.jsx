import { notFound } from "next/navigation";
import { MessageSquare, Users } from "lucide-react";
import { ChallengeSubmission } from "@/components/challenge/ChallengeSubmission";
import { HintUnlockList } from "@/components/challenge/HintUnlockList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { challenges } from "@/utils/constants";

export default async function ChallengePage({ params }) {
  const { challengeId } = await params;
  const challenge = challenges.find((item) => item.id === challengeId);

  if (!challenge) notFound();

  return (
    <PageShell className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <div className="cyber-panel rounded-xl p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{challenge.category}</Badge>
              <Badge tone="zinc">{challenge.difficulty}</Badge>
              <Badge tone="amber">{challenge.points} pts</Badge>
            </div>
            <h1 className="glitch mt-5 text-4xl font-black uppercase md:text-6xl">{challenge.title}</h1>
            <p className="mt-5 text-lg leading-8 text-cyber-muted">{challenge.description}</p>
          </div>
          <ChallengeSubmission challengeId={challenge.id} />
          <Card>
            <h2 className="text-2xl font-black uppercase">Hints</h2>
            <div className="mt-5">
              <HintUnlockList hints={challenge.hints} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black uppercase">Discussion</h2>
              <Button href={`/challenge/${challenge.id}/discussion`} variant="secondary" icon={MessageSquare}>
                Open
              </Button>
            </div>
            <div className="mt-5 grid gap-3">
              {challenge.discussions.map((item) => (
                <div key={`${item.author}-${item.time}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-bold">{item.author}</p>
                  <p className="mt-2 text-sm leading-6 text-cyber-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
        <aside className="grid h-fit gap-4">
          <Card glow>
            <h2 className="text-xl font-black uppercase">Challenge intel</h2>
            <div className="mt-5 grid gap-3 text-sm text-cyber-muted">
              <p>Author: {challenge.author}</p>
              <p>Solves: {challenge.solves}</p>
              <p>Attachments: {challenge.attachments.join(", ")}</p>
            </div>
          </Card>
          <Card glow>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-cyber-red" />
              <h2 className="text-xl font-black uppercase">Solvers</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {challenge.solvers.map((solver, index) => (
                <p key={solver} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                  #{index + 1} {solver}
                </p>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
