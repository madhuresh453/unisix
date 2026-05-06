import { DashboardSubpage } from "@/components/dashboard/DashboardSubpage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardBadgesPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Badges" />
      <DashboardSubpage type="badges" />
    </div>
  );
}
