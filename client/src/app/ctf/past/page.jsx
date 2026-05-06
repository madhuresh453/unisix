import { PastEventsTable } from "@/components/ctf/PastEventsTable";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { events } from "@/utils/constants";

const tabs = [
  { label: "Live", value: "live", href: "/ctf/live" },
  { label: "Upcoming", value: "upcoming", href: "/ctf/upcoming" },
  { label: "Past", value: "past", href: "/ctf/past" }
];

export default function PastCTFPage() {
  const past = events.filter((event) => event.status === "past");

  return (
    <PageShell className="grid gap-8">
      <SectionHeader eyebrow="Past" title="Competition archives and writeups" />
      <Tabs tabs={tabs} active="past" />
      <PastEventsTable events={past} />
    </PageShell>
  );
}
