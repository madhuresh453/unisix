import { Leaderboard } from "../models/Leaderboard.js";
import { Submission } from "../models/Submission.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";

export async function buildGlobalLeaderboardRows(limit = 50) {
  const users = await User.find({})
    .sort({ score: -1, updatedAt: 1 })
    .limit(limit)
    .populate("team", "name")
    .lean();

  return users.map((user, index) => ({
    rank: index + 1,
    user: user.handle,
    team: user.team?.name || "solo",
    country: user.country || "NA",
    score: user.score || 0,
    points: user.points || 0
  }));
}

export async function buildTeamLeaderboardRows(limit = 50) {
  const teams = await Team.find({}).sort({ score: -1, updatedAt: 1 }).limit(limit).lean();

  return teams.map((team, index) => ({
    rank: index + 1,
    user: team.name,
    team: team.name,
    country: team.country || "NA",
    score: team.score || 0,
    points: team.points || 0
  }));
}

export async function buildCountryLeaderboardRows(limit = 50) {
  const rows = await User.aggregate([
    {
      $group: {
        _id: "$country",
        score: { $sum: "$score" },
        points: { $sum: "$points" },
        users: { $sum: 1 }
      }
    },
    { $sort: { score: -1 } },
    { $limit: limit }
  ]);

  return rows.map((row, index) => ({
    rank: index + 1,
    user: row._id || "NA",
    country: row._id || "NA",
    team: `${row.users} users`,
    score: row.score || 0,
    points: row.points || 0
  }));
}

export async function buildEventLeaderboardRows(ctfId, limit = 50) {
  const rows = await Submission.aggregate([
    { $match: { ctf: ctfId, status: "accepted" } },
    {
      $group: {
        _id: "$user",
        score: { $sum: "$pointsAwarded" },
        points: { $sum: "$pointsAwarded" },
        solves: { $sum: 1 },
        lastSolveAt: { $max: "$createdAt" }
      }
    },
    { $sort: { score: -1, lastSolveAt: 1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ]);

  return rows.map((row, index) => ({
    rank: index + 1,
    user: row.user.handle,
    team: "event",
    country: row.user.country || "NA",
    score: row.score,
    points: row.points,
    solves: row.solves
  }));
}

export async function snapshotLeaderboard(scope = "global", ctfId = null) {
  const rows =
    scope === "team"
      ? await buildTeamLeaderboardRows()
      : scope === "country"
        ? await buildCountryLeaderboardRows()
        : scope === "event"
          ? await buildEventLeaderboardRows(ctfId)
          : await buildGlobalLeaderboardRows();

  await Leaderboard.deleteMany({ scope, ctf: ctfId || undefined });

  await Leaderboard.insertMany(
    rows.map((row) => ({
      scope,
      ctf: ctfId,
      subjectType: scope === "team" ? "Team" : scope === "country" ? "Country" : "User",
      subjectId: row.user,
      displayName: row.user,
      country: row.country,
      score: row.score,
      points: row.points,
      rank: row.rank,
      solves: row.solves || 0
    }))
  );

  return rows;
}
