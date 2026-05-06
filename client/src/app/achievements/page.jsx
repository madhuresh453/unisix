import { AchievementGrid } from "@/components/home/AchievementGrid";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AchievementsPage() {
  return (
    <PageShell className="grid gap-10">
      <SectionHeader
        eyebrow="Achievements"
        title="Rankings, awards, disclosures, and learning milestones"
        body="Celebrate the work that happens around the scoreboard: publishing, mentoring, defending, and responsibly reporting."
      />
      <AchievementGrid />
    </PageShell>
  );
}
