import { CalendarClock, Flag, Trophy } from "lucide-react";
import { events } from "@/utils/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Countdown } from "./Countdown";

export function LiveEventFeature() {
  const event = events.find((item) => item.status === "live");

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 md:p-8">
          <Badge tone="green">Live now</Badge>
          <h3 className="mt-5 text-3xl font-black uppercase md:text-5xl">{event.name}</h3>
          <p className="mt-4 w-full leading-7 text-cyber-muted">{event.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-cyber-muted sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-cyber-red" />
              {event.format}
            </span>
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-cyber-red" />
              {event.prize} prize
            </span>
            <span className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-cyber-red" />
              {event.participants} players
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={`/ctf/${event.id}`}>Join event</Button>
            <Button href="/ctf/live" variant="secondary">View scoreboard</Button>
          </div>
        </div>
        <div className="border-t border-white/10 bg-cyber-red/5 p-6 md:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyber-muted">Ends in</p>
          <div className="mt-4">
            <Countdown targetDate={event.endsAt} />
          </div>
          <div className="mt-6 grid gap-3">
            {event.categories.map((category) => (
              <div key={category} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="font-bold uppercase tracking-[0.12em]">{category}</span>
                <span className="text-sm text-cyber-muted">active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
