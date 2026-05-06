import { DashboardSubpage } from "@/components/dashboard/DashboardSubpage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardActivityPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Activity" />
      <DashboardSubpage type="activity" />
    </div>
  );
}
