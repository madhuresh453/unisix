import { Card } from "@/components/ui/Card";

const content = {
  activity: [
    "Solved challenges and team events are tracked as an immutable activity feed.",
    "Notification events can be streamed from Socket.io into this view."
  ],
  submissions: [
    "Every flag attempt includes verdict, latency, IP metadata, and anti-cheat signals.",
    "Accepted solves are idempotent and linked to scoring snapshots."
  ],
  challenges: [
    "Assigned challenges are grouped by category, difficulty, solve state, and active CTF.",
    "Practice arena progress can share the same model as live events."
  ],
  hints: [
    "Unlocked hints are audited and deducted through the scoring service.",
    "Hint visibility stays user-specific and does not expose hidden challenge state."
  ],
  badges: [
    "Badges reward first bloods, consistency, writeups, and specialist category streaks.",
    "Achievement rules can be scheduled through backend jobs."
  ],
  teams: [
    "Team membership, invitations, roles, and event registrations belong here.",
    "Captains can manage rosters without touching platform admin controls."
  ],
  settings: [
    "Profile, password, API token, notification, and privacy controls should live here.",
    "Sensitive changes require current password or fresh JWT verification."
  ]
};

export function DashboardSubpage({ type }) {
  const rows = content[type] || [];

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <Card key={row} glow>
          <p className="text-lg leading-7 text-cyber-muted">{row}</p>
        </Card>
      ))}
    </div>
  );
}
