import crypto from "crypto";
import { env } from "../config/env.js";
import { Challenge } from "../models/Challenge.js";
import { Submission } from "../models/Submission.js";
import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Solve } from "../models/Solve.js";
import { AttemptLog } from "../models/AttemptLog.js";
import { emitScoreboard } from "../config/socket.js";
import { buildEventLeaderboardRows } from "./leaderboardService.js";

export function normalizeFlag(flag) {
  return String(flag || "").trim();
}

export function createFlagHash(flag, salt = crypto.randomBytes(16).toString("hex")) {
  const normalized = normalizeFlag(flag);
  const flagHash = crypto
    .createHmac("sha256", env.flagPepper)
    .update(`${salt}:${normalized}`)
    .digest("hex");

  return { flagHash, flagSalt: salt };
}

export function verifyFlagHash(flag, challenge) {
  const normalized = normalizeFlag(flag);
  const candidate = crypto
    .createHmac("sha256", env.flagPepper)
    .update(`${challenge.flagSalt}:${normalized}`)
    .digest("hex");

  const candidateBuffer = Buffer.from(candidate, "hex");
  const storedBuffer = Buffer.from(challenge.flagHash, "hex");

  return candidateBuffer.length === storedBuffer.length && crypto.timingSafeEqual(candidateBuffer, storedBuffer);
}

export function calculateDynamicPoints(challenge) {
  const solvePressure = Math.max(challenge.solverCount || 0, 0);
  const decay = solvePressure * Math.ceil(challenge.basePoints * 0.012);
  return Math.max(50, challenge.basePoints - decay);
}

export async function validateAndScoreSubmission({ user, challengeId, flag, ip, userAgent, latencyMs, antiCheat }) {
  const challenge = await Challenge.findById(challengeId).select("+flagHash +flagSalt");

  if (!challenge || !challenge.isPublished) {
    const error = new Error("Challenge not found.");
    error.statusCode = 404;
    throw error;
  }

  const duplicate = await Submission.findOne({
    user: user._id,
    challenge: challenge._id,
    status: "accepted"
  });

  if (duplicate) {
    const submission = await Submission.create({
      user: user._id,
      team: user.team,
      ctf: challenge.ctf,
      challenge: challenge._id,
      flagPreview: maskFlag(flag),
      status: "duplicate",
      pointsAwarded: 0,
      ip,
      userAgent,
      latencyMs,
      antiCheat
    });
    await AttemptLog.create({
      user: user._id,
      challenge: challenge._id,
      ctf: challenge.ctf,
      status: "duplicate",
      ip,
      userAgent,
      riskScore: antiCheat.riskScore || 0
    });

    return { accepted: true, duplicate: true, submission, points: 0, message: "Already solved." };
  }

  const accepted = verifyFlagHash(flag, challenge);
  const pointsAwarded = accepted ? calculateDynamicPoints(challenge) : 0;

  const submission = await Submission.create({
    user: user._id,
    team: user.team,
    ctf: challenge.ctf,
    challenge: challenge._id,
    flagPreview: maskFlag(flag),
    status: accepted ? "accepted" : antiCheat.riskScore >= 80 ? "review" : "rejected",
    pointsAwarded,
    ip,
    userAgent,
    latencyMs,
    antiCheat
  });
  await AttemptLog.create({
    user: user._id,
    challenge: challenge._id,
    ctf: challenge.ctf,
    status: accepted ? "accepted" : antiCheat.riskScore >= 80 ? "review" : "rejected",
    ip,
    userAgent,
    riskScore: antiCheat.riskScore || 0
  });

  if (!accepted) {
    return { accepted: false, duplicate: false, submission, points: 0, message: "Incorrect flag." };
  }

  const existingFirst = await Solve.findOne({ challenge: challenge._id });
  const firstBlood = !existingFirst;

  await Challenge.updateOne(
    { _id: challenge._id },
    {
      $addToSet: { solves: user._id },
      $inc: { solverCount: 1 },
      $set: { currentPoints: Math.max(50, pointsAwarded - 4) }
    }
  );

  await User.updateOne(
    { _id: user._id },
    {
      $addToSet: { solvedChallenges: challenge._id },
      $inc: { score: pointsAwarded, points: pointsAwarded }
    }
  );

  await Solve.create({
    user: user._id,
    team: user.team,
    ctf: challenge.ctf,
    challenge: challenge._id,
    submission: submission._id,
    pointsAwarded,
    firstBlood
  });

  if (user.team) {
    await Team.updateOne(
      { _id: user.team },
      { $inc: { score: pointsAwarded, points: pointsAwarded } }
    );
  }

  if (challenge.ctf) {
    const rows = await buildEventLeaderboardRows(challenge.ctf);
    emitScoreboard(challenge.ctf.toString(), rows);
  }

  return {
    accepted: true,
    duplicate: false,
    submission,
    points: pointsAwarded,
    firstBlood,
    message: firstBlood ? "Accepted. First blood!" : "Accepted."
  };
}

function maskFlag(flag) {
  const normalized = normalizeFlag(flag);
  if (normalized.length <= 12) return "UNI6{***}";
  return `${normalized.slice(0, 6)}...${normalized.slice(-2)}`;
}
