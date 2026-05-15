"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Search, X } from "lucide-react";
import { TeamModal } from "@/components/ctf/TeamModal";
import { TopTeamBanner } from "@/components/ctf/TopTeamBanner";
import { cn } from "@/utils/helpers";

export function ScoreboardTable({ eventTitle, rows = [], loading = false, error = "" }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showFullResults, setShowFullResults] = useState(false);
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const normalizedRows = useMemo(
    () =>
      rows.map((row, index) => ({
        ...row,
        rank: Number(row.rank ?? index + 1),
        memberCount: Number(row.memberCount ?? row.members?.length ?? 0),
      })),
    [rows]
  );

  const previewRows = useMemo(() => normalizedRows.slice(0, 10), [normalizedRows]);
  const availableCountries = useMemo(
    () => ["all", ...new Set(normalizedRows.map((row) => row.country).filter(Boolean))],
    [normalizedRows]
  );
  const filteredRows = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    return normalizedRows.filter((row) => {
      const matchesCountry = countryFilter === "all" || String(row.country).toLowerCase() === String(countryFilter).toLowerCase();
      const matchesQuery =
        !trimmedQuery ||
        String(row.team).toLowerCase().includes(trimmedQuery) ||
        String(row.country).toLowerCase().includes(trimmedQuery);
      return matchesCountry && matchesQuery;
    });
  }, [normalizedRows, query, countryFilter]);

  useEffect(() => {
    if (!showFullResults) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setShowFullResults(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showFullResults]);

  const topTeam = normalizedRows[0];

  return (
    <div className="cyber-panel rounded-xl p-5">
      <TopTeamBanner eventTitle={eventTitle} topTeam={topTeam} />

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

      <DataTable
        columns={["Rank", "Team", "Country", "Score", "Points", "Members"]}
        rows={previewRows}
        emptyMessage={error || "No leaderboard data available"}
        renderRow={(row) => (
          <tr
            key={`${row.rank}-${row.team}`}
            className={cn(
              "cursor-pointer transition duration-300 hover:bg-white/[0.03]",
              row.rank === 1 ? "shadow-[inset_0_0_0_1px_rgba(250,204,21,0.35)]" : "",
              row.rank === 2 ? "shadow-[inset_0_0_0_1px_rgba(226,232,240,0.35)]" : "",
              row.rank === 3 ? "shadow-[inset_0_0_0_1px_rgba(251,146,60,0.3)]" : ""
            )}
            onClick={() => setSelectedTeam(row)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedTeam(row);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open details for team ${row.team}`}
          >
            <td className="px-6 py-4 text-lg font-black text-cyber-red">#{row.rank}</td>
            <td className="px-6 py-4 font-bold">{row.team}</td>
            <td className="px-6 py-4 text-cyber-muted">{row.country}</td>
            <td className="px-6 py-4 font-bold tabular-nums">{row.score}</td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
            <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.memberCount}</td>
          </tr>
        )}
      />
      {normalizedRows.length > 10 ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowFullResults(true)}
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-cyber-red/45 bg-cyber-red/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-glow transition-all duration-300 hover:border-cyber-red hover:bg-cyber-red/20"
          >
            View Full Results
          </button>
        </div>
      ) : null}

      {showFullResults ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" onClick={() => setShowFullResults(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${eventTitle} full results`}
            className="cyber-panel w-full max-w-6xl rounded-2xl border border-cyber-red/30 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyber-red">Full Rankings</p>
                <h3 className="mt-1 font-teko text-4xl uppercase leading-none">{eventTitle}</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-cyber-muted">
                  Showing {filteredRows.length} Teams
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullResults(false)}
                aria-label="Close full results"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-cyber-muted transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#080808]/80 px-3 py-2">
                <Search className="h-4 w-4 text-cyber-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search team or country"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-cyber-muted"
                />
              </label>
              <select
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
                className="focus-ring rounded-xl border border-white/10 bg-[#080808]/80 px-3 py-2 text-sm text-white outline-none"
              >
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country === "all" ? "All Countries" : country}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <DataTable
                columns={["Rank", "Team", "Country", "Score", "Points", "Members"]}
                rows={filteredRows}
                emptyMessage="No teams match your filters"
                renderRow={(row) => (
                  <tr
                    key={`full-${row.rank}-${row.team}`}
                    className={cn(
                      "cursor-pointer transition duration-300 hover:bg-white/[0.03]",
                      row.rank === 1 ? "shadow-[inset_0_0_0_1px_rgba(250,204,21,0.35)]" : "",
                      row.rank === 2 ? "shadow-[inset_0_0_0_1px_rgba(226,232,240,0.35)]" : "",
                      row.rank === 3 ? "shadow-[inset_0_0_0_1px_rgba(251,146,60,0.3)]" : ""
                    )}
                    onClick={() => setSelectedTeam(row)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTeam(row);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open details for team ${row.team}`}
                  >
                    <td className="px-6 py-4 text-lg font-black text-cyber-red">#{row.rank}</td>
                    <td className="px-6 py-4 font-bold">{row.team}</td>
                    <td className="px-6 py-4 text-cyber-muted">{row.country}</td>
                    <td className="px-6 py-4 font-bold tabular-nums">{row.score}</td>
                    <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.points}</td>
                    <td className="px-6 py-4 text-cyber-muted tabular-nums">{row.memberCount}</td>
                  </tr>
                )}
              />
            </div>
          </div>
        </div>
      ) : null}

      <TeamModal open={Boolean(selectedTeam)} team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </div>
  );
}
