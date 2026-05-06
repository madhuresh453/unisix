import { EventCard } from "@/components/ctf/EventCard";
import { LiveScoreboard } from "@/components/ctf/LiveScoreboard";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { events } from "@/utils/constants";

const tabs = [
  { label: "Live", value: "live", href: "/ctf/live" },
  { label: "Upcoming", value: "upcoming", href: "/ctf/upcoming" },
  { label: "Past", value: "past", href: "/ctf/past" }
];

export default function LiveCTFPage() {
  const liveEvents = events.filter((event) => event.status === "live");

  return (
    <PageShell className="grid gap-8">
      <SectionHeader eyebrow="Live" title="Active competitions" />
      <Tabs tabs={tabs} active="live" />
      <div className="grid gap-4 lg:grid-cols-2">
        {liveEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <LiveScoreboard />
    </PageShell>
  );
}
