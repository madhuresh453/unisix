import { notFound } from "next/navigation";
import { CalendarClock, Flag, Trophy, Users } from "lucide-react";
import { LiveScoreboard } from "@/components/ctf/LiveScoreboard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { events, challenges } from "@/utils/constants";
import { formatDateTime } from "@/utils/formatters";

export default async function EventDetailPage({ params }) {
  const { eventId } = await params;
  const event = events.find((item) => item.id === eventId);

  if (!event) notFound();

  return (
    <PageShell className="grid gap-8">
      <div className="cyber-panel rounded-xl p-6 md:p-8">
        <Badge tone={event.status === "live" ? "green" : "amber"}>{event.status}</Badge>
        <h1 className="glitch mt-5 text-4xl font-black uppercase md:text-6xl">{event.name}</h1>
        <p className="mt-4 w-full leading-7 text-cyber-muted">{event.description}</p>
        <div className="mt-6 grid gap-3 text-sm text-cyber-muted sm:grid-cols-2 lg:grid-cols-4">
          <span className="flex items-center gap-2"><Flag className="h-4 w-4 text-cyber-red" />{event.format}</span>
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-cyber-red" />{event.teams} teams</span>
          <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-cyber-red" />{event.prize}</span>
          <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-cyber-red" />{formatDateTime(event.startsAt)}</span>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/auth/register">Register team</Button>
          <Button href="/challenge/shadow-login" variant="secondary">Open challenges</Button>
        </div>
      </div>
      {event.status === "live" ? <LiveScoreboard eventId={event.id} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} glow>
            <Badge tone="zinc">{challenge.category}</Badge>
            <h2 className="mt-4 text-xl font-black uppercase">{challenge.title}</h2>
            <p className="mt-2 text-sm text-cyber-muted">{challenge.difficulty} / {challenge.points} pts</p>
            <Button href={`/challenge/${challenge.id}`} variant="secondary" className="mt-5">
              View challenge
            </Button>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
