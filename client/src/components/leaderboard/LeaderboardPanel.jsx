"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/utils/helpers";

const tabs = ["global", "team", "country"];

export function LeaderboardPanel() {
  const [active, setActive] = useState("global");
  const rows = useLeaderboard(active);

  return (
    <div className="cyber-panel rounded-xl p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cn(
                "focus-ring rounded-xl px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] transition",
                active === tab ? "bg-cyber-red text-white shadow-glow" : "bg-white/5 text-cyber-muted hover:text-white"
              )}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <Badge tone="green">Live ranking</Badge>
      </div>
      <DataTable
        columns={["Rank", active === "global" ? "User" : active, "Score", "Points"]}
        rows={rows}
        renderRow={(row) => (
          <tr key={`${active}-${row.rank}-${row.user}`} className="transition hover:bg-white/[0.03]">
            <td className="px-6 py-4 text-lg font-black text-cyber-red">#{row.rank}</td>
            <td className="px-6 py-4 font-bold">{row.user}</td>
            <td className="px-6 py-4 font-bold tabular-nums">{row.score}</td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
          </tr>
        )}
      />
    </div>
  );
}
