"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const REFRESH_INTERVAL_MS = 15000;

export function useLeaderboard(type = "global") {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.floor(REFRESH_INTERVAL_MS / 1000));
  const currentRowsRef = useRef([]);
  const previousRowsRef = useRef([]);

  const fetchLeaderboard = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch("/api/scoreboard", {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to fetch scoreboard");
      }

      const incomingRows = Array.isArray(payload?.rows) ? payload.rows : [];
      previousRowsRef.current = currentRowsRef.current;
      currentRowsRef.current = incomingRows;
      setRows(incomingRows);
      setLastUpdated(payload?.fetchedAt || new Date().toISOString());
      setError("");
      setSecondsUntilRefresh(Math.floor(REFRESH_INTERVAL_MS / 1000));
    } catch (fetchError) {
      const nextError = fetchError instanceof Error ? fetchError.message : "Unable to load leaderboard";
      setError(nextError);
      // Keep the last successful snapshot visible while signaling degraded network state.
      setRows((currentRows) => (currentRows.length ? currentRows : currentRowsRef.current));
      console.warn("[useLeaderboard] Live fetch failed", { message: nextError });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(true);

    const intervalId = window.setInterval(() => {
      fetchLeaderboard(false);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [fetchLeaderboard]);

  useEffect(() => {
    const countdownId = window.setInterval(() => {
      setSecondsUntilRefresh((current) => (current <= 1 ? Math.floor(REFRESH_INTERVAL_MS / 1000) : current - 1));
    }, 1000);

    return () => window.clearInterval(countdownId);
  }, []);

  return useMemo(() => {
    const previousByTeam = new Map(previousRowsRef.current.map((row) => [row.team || row.user, row]));
    const enrichedRows = rows.map((row, index) => {
      const identity = row.team || row.user;
      const previous = previousByTeam.get(identity);
      const previousScore = Number(previous?.score || 0);
      const previousRank = Number(previous?.rank || index + 1);
      const currentScore = Number(row?.score || 0);
      const currentRank = Number(row?.rank || index + 1);

      return {
        ...row,
        topTier: currentRank <= 3 ? currentRank : 0,
        scoreIncreased: currentScore > previousScore,
        rankImproved: currentRank < previousRank,
      };
    });

    const normalizedRows =
      type === "country"
        ? enrichedRows.map((row) => ({ ...row, user: row.country || "Global" }))
        : type === "team"
          ? enrichedRows.map((row) => ({ ...row, user: row.team || row.user || "Unknown Team" }))
          : enrichedRows.map((row) => ({ ...row, user: row.user || row.team || "Unknown Team" }));

    return {
      rows: normalizedRows,
      loading,
      error,
      degraded: Boolean(error),
      empty: !loading && normalizedRows.length === 0,
      lastUpdated,
      isRefreshing,
      secondsUntilRefresh,
      refreshIntervalMs: REFRESH_INTERVAL_MS,
    };
  }, [type, rows, loading, error, lastUpdated, isRefreshing, secondsUntilRefresh]);
}
