"use client";

import { useEffect, useState } from "react";
import { Activity, Trophy, Wifi, WifiOff } from "lucide-react";
import { leaderboardRows } from "@/utils/constants";
import { useSocket } from "@/hooks/useSocket";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { cn } from "@/utils/helpers";

export function LiveScoreboard({ eventId = "redline-2026", source = "api" }) {
  const { socket, connected } = useSocket();
  const [rows, setRows] = useState(leaderboardRows);
  const {
    rows: liveRows,
    loading,
    error,
    degraded,
    empty,
    lastUpdated,
    isRefreshing,
    secondsUntilRefresh,
    refreshIntervalMs,
  } = useLeaderboard("global");

  useEffect(() => {
    if (source !== "socket") return undefined;
    if (!socket) return undefined;

    socket.emit("scoreboard:join", { eventId });
    socket.on("scoreboard:update", (payload) => {
      if (payload?.rows?.length) setRows(payload.rows);
    });

    return () => {
      socket.emit("scoreboard:leave", { eventId });
      socket.off("scoreboard:update");
    };
  }, [socket, eventId, source]);

  const activeRows = source === "socket" ? rows : liveRows;
  const refreshEverySeconds = Math.max(1, Math.round(refreshIntervalMs / 1000));
  const lastSeenLabel = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "waiting...";
  const topTeam = activeRows[0];

  return (
    <div className="cyber-panel rounded-xl p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black uppercase">Live scoreboard</h2>
          <p className="mt-1 text-sm text-cyber-muted">
            {source === "socket" ? "Socket.io powered ranking stream" : "Live CTFd ranking stream"}
          </p>
        </div>
        {source === "socket" ? (
          <Badge tone={connected ? "green" : "amber"}>{connected ? "connected" : "fallback"}</Badge>
        ) : (
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
        )}
      </div>
      {source !== "socket" && topTeam ? (
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
      {source !== "socket" ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.12em] text-cyber-muted">
          <Activity className="h-4 w-4 text-cyber-red" />
          Tracking live submissions...
        </div>
      ) : null}
      {source !== "socket" && loading ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-[#080808] p-4">
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="h-12 animate-pulse rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
          </div>
        </div>
      ) : null}
      <DataTable
        columns={["Rank", "User", "Team", "Country", "Score", "Points"]}
        rows={activeRows}
        emptyMessage={source === "socket" ? "No data available" : error ? "Live feed degraded" : empty ? "No leaderboard data available" : "No data available"}
        renderRow={(row) => (
          <tr
            key={`${row.rank}-${row.user}`}
            className={cn(
              "transition hover:bg-white/[0.03]",
              source !== "socket" && row.scoreIncreased ? "bg-emerald-300/10" : "",
              row.rank === 1 ? "shadow-[inset_0_0_0_1px_rgba(250,204,21,0.35)]" : "",
              row.rank === 2 ? "shadow-[inset_0_0_0_1px_rgba(226,232,240,0.35)]" : "",
              row.rank === 3 ? "shadow-[inset_0_0_0_1px_rgba(251,146,60,0.3)]" : ""
            )}
          >
            <td className={cn("px-6 py-4 font-black text-cyber-red", source !== "socket" && row.rankImproved ? "text-emerald-300" : "")}>#{row.rank}</td>
            <td className="px-6 py-4 font-bold">{row.user}</td>
            <td className="px-6 py-4 text-cyber-muted">{row.team}</td>
            <td className="px-6 py-4 text-cyber-muted">{row.country}</td>
            <td className={cn("px-6 py-4 font-bold tabular-nums", source !== "socket" && row.scoreIncreased ? "text-emerald-300" : "")}>{row.score}</td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
          </tr>
        )}
      />
      {source !== "socket" ? (
        <p className="mt-3 text-xs uppercase tracking-[0.12em] text-cyber-muted">
          <span className="inline-flex items-center gap-2">
            {degraded ? <WifiOff className="h-3.5 w-3.5 text-amber-300" /> : <Wifi className="h-3.5 w-3.5 text-emerald-300" />}
            {error ? "Live feed degraded." : `Auto-refresh active every ${refreshEverySeconds}s. Last sync ${lastSeenLabel}.`}
          </span>
        </p>
      ) : null}
    </div>
  );
}
