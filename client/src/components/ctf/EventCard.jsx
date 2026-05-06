import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/utils/formatters";

const toneByStatus = {
  live: "green",
  upcoming: "amber",
  past: "zinc"
};

export function EventCard({ event }) {
  return (
    <Card glow>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone={toneByStatus[event.status]}>{event.status}</Badge>
        <span className="text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">
          {event.difficulty}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-black uppercase">{event.name}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-cyber-muted">{event.description}</p>
      <div className="mt-5 grid gap-3 text-sm text-cyber-muted sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-cyber-red" />
          {formatDateTime(event.startsAt)}
        </span>
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyber-red" />
          {event.teams} teams
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {event.categories.map((category) => (
          <Badge key={category} tone="zinc">{category}</Badge>
        ))}
      </div>
      <div className="mt-6">
        <Button href={`/ctf/${event.id}`} variant={event.status === "past" ? "secondary" : "primary"}>
          {event.status === "past" ? "View archive" : "Register"}
        </Button>
      </div>
    </Card>
  );
}
