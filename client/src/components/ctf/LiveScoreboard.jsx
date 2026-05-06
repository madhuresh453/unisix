"use client";

import { useEffect, useState } from "react";
import { leaderboardRows } from "@/utils/constants";
import { useSocket } from "@/hooks/useSocket";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";

export function LiveScoreboard({ eventId = "redline-2026" }) {
  const { socket, connected } = useSocket();
  const [rows, setRows] = useState(leaderboardRows);

  useEffect(() => {
    if (!socket) return undefined;

    socket.emit("scoreboard:join", { eventId });
    socket.on("scoreboard:update", (payload) => {
      if (payload?.rows?.length) setRows(payload.rows);
    });

    return () => {
      socket.emit("scoreboard:leave", { eventId });
      socket.off("scoreboard:update");
    };
  }, [socket, eventId]);

  return (
    <div className="cyber-panel rounded-xl p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black uppercase">Live scoreboard</h2>
          <p className="mt-1 text-sm text-cyber-muted">Socket.io powered ranking stream</p>
        </div>
        <Badge tone={connected ? "green" : "amber"}>{connected ? "connected" : "fallback"}</Badge>
      </div>
      <DataTable
        columns={["Rank", "User", "Team", "Country", "Score", "Points"]}
        rows={rows}
        renderRow={(row) => (
          <tr key={`${row.rank}-${row.user}`} className="transition hover:bg-white/[0.03]">
            <td className="px-6 py-4 font-black text-cyber-red">#{row.rank}</td>
            <td className="px-6 py-4 font-bold">{row.user}</td>
            <td className="px-6 py-4 text-cyber-muted">{row.team}</td>
            <td className="px-6 py-4 text-cyber-muted">{row.country}</td>
            <td className="px-6 py-4 font-bold tabular-nums">{row.score}</td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
          </tr>
        )}
      />
    </div>
  );
}
