import { Submission } from "../models/Submission.js";
import { inspectSubmission } from "../services/antiCheatService.js";
import { validateAndScoreSubmission } from "../services/scoringService.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

export const submitFlag = asyncHandler(async (req, res) => {
  const startedAt = Date.now();
  const antiCheat = await inspectSubmission({
    user: req.user,
    challengeId: req.body.challengeId,
    ip: req.ip,
    flag: req.body.flag
  });

  const result = await validateAndScoreSubmission({
    user: req.user,
    challengeId: req.body.challengeId,
    flag: req.body.flag,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    latencyMs: Date.now() - startedAt,
    antiCheat
  });

  res.status(result.accepted ? 200 : 202).json({
    accepted: result.accepted,
    duplicate: result.duplicate,
    firstBlood: result.firstBlood || false,
    points: result.points,
    message: result.message,
    antiCheat: antiCheat.riskScore >= 80 ? antiCheat : undefined
  });
});

export const mySubmissions = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const [submissions, total] = await Promise.all([
    Submission.find({ user: req.user._id })
      .populate("challenge", "title category difficulty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments({ user: req.user._id })
  ]);

  res.json({ page, total, submissions });
});

export const listSubmissions = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const [submissions, total] = await Promise.all([
    Submission.find({})
      .populate("user", "handle email")
      .populate("challenge", "title category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments()
  ]);

  res.json({ page, total, submissions });
});
