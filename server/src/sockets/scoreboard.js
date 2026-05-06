import mongoose from "mongoose";
import { buildEventLeaderboardRows, buildGlobalLeaderboardRows } from "../services/leaderboardService.js";

export function registerScoreboardSocket(io, socket) {
  socket.on("scoreboard:join", async ({ eventId } = {}) => {
    const room = `scoreboard:${eventId || "global"}`;
    socket.join(room);

    const rows =
      eventId && mongoose.isValidObjectId(eventId)
        ? await buildEventLeaderboardRows(new mongoose.Types.ObjectId(eventId))
        : await buildGlobalLeaderboardRows();

    socket.emit("scoreboard:update", { eventId, rows });
  });

  socket.on("scoreboard:leave", ({ eventId } = {}) => {
    socket.leave(`scoreboard:${eventId || "global"}`);
  });
}
