import { EventCard } from "@/components/ctf/EventCard";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { events } from "@/utils/constants";

const tabs = [
  { label: "Live", value: "live", href: "/ctf/live" },
  { label: "Upcoming", value: "upcoming", href: "/ctf/upcoming" },
  { label: "Past", value: "past", href: "/ctf/past" }
];

export default function UpcomingCTFPage() {
  const upcoming = events.filter((event) => event.status === "upcoming");

  return (
    <PageShell className="grid gap-8">
      <SectionHeader eyebrow="Upcoming" title="Register before the window opens" />
      <Tabs tabs={tabs} active="upcoming" />
      <div className="grid gap-4 lg:grid-cols-2">
        {upcoming.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </PageShell>
  );
}
