import mongoose from "mongoose";
import {
  buildCountryLeaderboardRows,
  buildEventLeaderboardRows,
  buildGlobalLeaderboardRows,
  buildTeamLeaderboardRows
} from "../services/leaderboardService.js";
import { cacheGet, cacheSet } from "../config/cache.js";
import { asyncHandler } from "../utils/helpers.js";

export const globalLeaderboard = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const cacheKey = `leaderboard:global:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ scope: "global", rows: cached, cached: true });

  const rows = await buildGlobalLeaderboardRows(limit);
  await cacheSet(cacheKey, rows, 15);
  res.json({ scope: "global", rows });
});

export const teamLeaderboard = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const cacheKey = `leaderboard:team:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ scope: "team", rows: cached, cached: true });

  const rows = await buildTeamLeaderboardRows(limit);
  await cacheSet(cacheKey, rows, 15);
  res.json({ scope: "team", rows });
});

export const countryLeaderboard = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const cacheKey = `leaderboard:country:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ scope: "country", rows: cached, cached: true });

  const rows = await buildCountryLeaderboardRows(limit);
  await cacheSet(cacheKey, rows, 15);
  res.json({ scope: "country", rows });
});

export const eventLeaderboard = asyncHandler(async (req, res) => {
  const ctfId = new mongoose.Types.ObjectId(req.params.ctfId);
  const limit = Number(req.query.limit || 50);
  const cacheKey = `leaderboard:event:${req.params.ctfId}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ scope: "event", ctfId, rows: cached, cached: true });

  const rows = await buildEventLeaderboardRows(ctfId, limit);
  await cacheSet(cacheKey, rows, 10);
  res.json({ scope: "event", ctfId, rows });
});
