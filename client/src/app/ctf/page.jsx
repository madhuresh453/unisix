import { EventCard } from "@/components/ctf/EventCard";
import { Tabs } from "@/components/ui/Tabs";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { events } from "@/utils/constants";

const tabs = [
  { label: "Live", value: "live", href: "/ctf/live" },
  { label: "Upcoming", value: "upcoming", href: "/ctf/upcoming" },
  { label: "Past", value: "past", href: "/ctf/past" }
];

export default function CTFPage() {
  return (
    <PageShell className="grid gap-10">
      <SectionHeader
        eyebrow="CTF"
        title="Events built for high-signal competition"
        body="Browse live, upcoming, and past competitions with real-time scoring, writeups, and team registration."
      />
      <Tabs tabs={tabs} active="live" />
      <div className="grid gap-4 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </PageShell>
  );
}
