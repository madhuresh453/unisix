import { LeaderboardPanel } from "@/components/leaderboard/LeaderboardPanel";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function LeaderboardPage() {
  return (
    <PageShell className="grid gap-8">
      <SectionHeader
        eyebrow="Leaderboard"
        title="CTF4 CYBER CHALLENGE - TURKEY"
        body="Rankings update from accepted submissions and can be streamed during live events."
      />
      <LeaderboardPanel />
    </PageShell>
  );
}
