import { Crown } from "lucide-react";

export function TopTeamBanner({ eventTitle, topTeam }) {
  if (!topTeam) return null;

  return (
    <div className="mb-5 rounded-xl border border-cyber-red/35 bg-cyber-red/10 px-4 py-3 shadow-[0_0_18px_rgba(255,0,60,0.16)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-cyber-red">
          <Crown className="h-4 w-4" />
          Top Team - {eventTitle}
        </p>
        <p className="text-sm font-black uppercase tracking-[0.12em] text-white">
          #{topTeam.rank} {topTeam.team} - {topTeam.score} pts
        </p>
      </div>
    </div>
  );
}
