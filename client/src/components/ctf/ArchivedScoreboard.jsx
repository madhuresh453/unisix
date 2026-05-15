"use client";

import { ScoreboardTable } from "@/components/ctf/ScoreboardTable";

export function ArchivedScoreboard({ eventTitle, rows = [], error = "" }) {
  return <ScoreboardTable eventTitle={eventTitle} rows={rows} loading={false} error={error || "Archive unavailable"} />;
}
