import { DashboardSubpage } from "@/components/dashboard/DashboardSubpage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardTeamsPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Teams" />
      <DashboardSubpage type="teams" />
    </div>
  );
}
