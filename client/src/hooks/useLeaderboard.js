"use client";

import { useMemo } from "react";
import { leaderboardRows } from "@/utils/constants";

export function useLeaderboard(type = "global") {
  return useMemo(() => {
    if (type === "country") {
      return leaderboardRows.map((row) => ({ ...row, user: row.country }));
    }

    if (type === "team") {
      return leaderboardRows.map((row) => ({ ...row, user: row.team }));
    }

    return leaderboardRows;
  }, [type]);
}
