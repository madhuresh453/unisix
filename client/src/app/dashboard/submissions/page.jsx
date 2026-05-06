import { SubmissionList } from "@/components/dashboard/SubmissionList";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardSubmissionsPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Submissions" />
      <SubmissionList />
    </div>
  );
}
