import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProgressGraph } from "@/components/dashboard/ProgressGraph";
import { SubmissionList } from "@/components/dashboard/SubmissionList";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { dashboardStats } from "@/utils/constants";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <SectionHeader eyebrow="Dashboard" title="Operator overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProgressGraph />
        <ActivityFeed />
      </div>
      <SubmissionList />
    </div>
  );
}
