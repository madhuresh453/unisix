"use client";

import { useState } from "react";
import { Activity, Trophy, Wifi, WifiOff } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/utils/helpers";

const tabs = ["global", "team", "country"];

export function LeaderboardPanel() {
  const [active, setActive] = useState("global");
  const { rows, loading, error, degraded, empty, lastUpdated, isRefreshing, secondsUntilRefresh, refreshIntervalMs } =
    useLeaderboard(active);

  const refreshEverySeconds = Math.max(1, Math.round(refreshIntervalMs / 1000));
  const lastSeenLabel = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "waiting...";
  const topTeam = rows[0];

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
        <div className="flex items-center gap-2">
          <Badge tone="green" className="gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
            </span>
            Live ranking
          </Badge>
          <Badge tone={degraded ? "amber" : "zinc"}>
            {degraded ? "connection degraded" : isRefreshing ? "refreshing..." : `refreshing in ${secondsUntilRefresh}s`}
          </Badge>
        </div>
      </div>
      {topTeam ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyber-red/25 bg-cyber-red/10 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-cyber-red">
            <Trophy className="h-4 w-4" />
            Top Team
          </p>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-white">
            #{topTeam.rank} {topTeam.user} - {topTeam.score} pts
          </p>
        </div>
      ) : null}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.12em] text-cyber-muted">
        <Activity className="h-4 w-4 text-cyber-red" />
        Tracking live submissions...
      </div>
      {loading ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-[#080808] p-4">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
          </div>
        </div>
      ) : null}
      {empty ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 py-5 text-cyber-muted">
          <WifiOff className="h-5 w-5 text-amber-300" />
          <p className="text-sm uppercase tracking-[0.1em]">No leaderboard data available right now. Live feed is waiting.</p>
        </div>
      ) : null}
      <DataTable
        columns={["Rank", active === "global" ? "User" : active, "Score", "Points"]}
        rows={rows}
        emptyMessage={
          error
            ? "Live scoreboard is temporarily unavailable."
            : empty
              ? "No leaderboard data available"
              : "No data available"
        }
        renderRow={(row) => (
          <tr
            key={`${active}-${row.rank}-${row.user}`}
            className={cn(
              "transition duration-500 hover:bg-white/[0.03]",
              row.scoreIncreased ? "bg-emerald-300/10" : "",
              row.topTier === 1 ? "shadow-[inset_0_0_0_1px_rgba(250,204,21,0.35)]" : "",
              row.topTier === 2 ? "shadow-[inset_0_0_0_1px_rgba(226,232,240,0.35)]" : "",
              row.topTier === 3 ? "shadow-[inset_0_0_0_1px_rgba(251,146,60,0.3)]" : ""
            )}
          >
            <td
              className={cn(
                "px-6 py-4 text-lg font-black text-cyber-red transition-all duration-500",
                row.rankImproved ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]" : ""
              )}
            >
              #{row.rank}
            </td>
            <td className="px-6 py-4 font-bold">{row.user}</td>
            <td
              className={cn(
                "px-6 py-4 font-bold tabular-nums transition-all duration-500",
                row.scoreIncreased ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]" : ""
              )}
            >
              {row.score}
            </td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
          </tr>
        )}
      />
      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-cyber-muted">
        <span className="inline-flex items-center gap-2">
          {degraded ? <WifiOff className="h-3.5 w-3.5 text-amber-300" /> : <Wifi className="h-3.5 w-3.5 text-emerald-300" />}
          {error
            ? "Live feed warning: showing latest successful data."
            : `Auto-refresh active every ${refreshEverySeconds}s. Last sync ${lastSeenLabel}.`}
        </span>
      </p>
    </div>
  );
}
