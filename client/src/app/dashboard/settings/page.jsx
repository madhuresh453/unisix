import { DashboardSubpage } from "@/components/dashboard/DashboardSubpage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardSettingsPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Settings" />
      <DashboardSubpage type="settings" />
    </div>
  );
}
