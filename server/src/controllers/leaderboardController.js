import mongoose from "mongoose";
import {
  buildCountryLeaderboardRows,
  buildEventLeaderboardRows,
  buildGlobalLeaderboardRows,
  buildTeamLeaderboardRows
} from "../services/leaderboardService.js";
import { asyncHandler } from "../utils/helpers.js";

export const globalLeaderboard = asyncHandler(async (req, res) => {
  const rows = await buildGlobalLeaderboardRows(Number(req.query.limit || 50));
  res.json({ scope: "global", rows });
});

export const teamLeaderboard = asyncHandler(async (req, res) => {
  const rows = await buildTeamLeaderboardRows(Number(req.query.limit || 50));
  res.json({ scope: "team", rows });
});

export const countryLeaderboard = asyncHandler(async (req, res) => {
  const rows = await buildCountryLeaderboardRows(Number(req.query.limit || 50));
  res.json({ scope: "country", rows });
});

export const eventLeaderboard = asyncHandler(async (req, res) => {
  const ctfId = new mongoose.Types.ObjectId(req.params.ctfId);
  const rows = await buildEventLeaderboardRows(ctfId, Number(req.query.limit || 50));
  res.json({ scope: "event", ctfId, rows });
});
