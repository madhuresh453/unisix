import { snapshotLeaderboard } from "../services/leaderboardService.js";

export function startLeaderboardJob() {
  const interval = setInterval(() => {
    snapshotLeaderboard("global").catch((error) => console.error("Leaderboard job failed", error));
  }, 60 * 1000);

  return () => clearInterval(interval);
}
