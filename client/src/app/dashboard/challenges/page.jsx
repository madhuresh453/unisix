import { DashboardSubpage } from "@/components/dashboard/DashboardSubpage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardChallengesPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Challenges" />
      <DashboardSubpage type="challenges" />
    </div>
  );
}
