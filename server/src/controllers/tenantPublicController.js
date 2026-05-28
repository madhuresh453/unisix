import { CTFEvent } from "../models/CTFEvent.js";
import { EventChallenge } from "../models/EventChallenge.js";
import { EventConfig } from "../models/EventConfig.js";
import { EventNotification } from "../models/EventNotification.js";
import { EventPage } from "../models/EventPage.js";
import { EventSubmission } from "../models/EventSubmission.js";
import { EventTeam } from "../models/EventTeam.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

export const getPublicEvent = asyncHandler(async (req, res) => {
  const ctf = await CTFEvent.findOne({ slug: req.params.slug, archived: false }).lean();
  if (!ctf) return res.status(404).json({ message: "CTF not found." });

  if (ctf.visibility === "private" && !req.user) {
    return res.status(403).json({ message: "Private event." });
  }

  const config = await EventConfig.findOne({ ctfId: ctf._id }).lean();
  return res.json({ ctf, config });
});

export const listPublicChallenges = asyncHandler(async (req, res) => {
  const ctf = req.ctf;
  const now = new Date();
  const { limit, skip, page } = pagination(req.query);

  const filter = {
    ctfId: ctf._id,
    visible: true,
    $or: [{ releaseAt: null }, { releaseAt: { $lte: now } }]
  };

  const [challenges, total] = await Promise.all([
    EventChallenge.find(filter).sort({ order: 1, createdAt: 1 }).skip(skip).limit(limit).lean(),
    EventChallenge.countDocuments(filter)
  ]);

  res.json({ page, total, challenges });
});

export const listPublicPages = asyncHandler(async (req, res) => {
  const pages = await EventPage.find({ ctfId: req.ctf._id, published: true, visibility: "public" }).sort({ createdAt: -1 }).lean();
  res.json({ pages });
});

export const listPublicNotifications = asyncHandler(async (req, res) => {
  const notifications = await EventNotification.find({ ctfId: req.ctf._id, visible: true }).sort({ createdAt: -1 }).limit(20).lean();
  res.json({ notifications });
});

export const eventScoreboard = asyncHandler(async (req, res) => {
  const ctf = req.ctf;
  const teams = await EventTeam.find({ ctfId: ctf._id, hidden: false, banned: false }).sort({ score: -1, updatedAt: 1 }).limit(200).lean();
  const rows = teams.map((team, index) => ({
    rank: index + 1,
    team: team.name,
    score: team.score,
    points: team.score,
    members: Array.isArray(team.members) ? team.members.length : 0
  }));

  res.json({ scope: "event", ctfId: ctf._id, rows });
});

export const submitEventFlag = asyncHandler(async (req, res) => {
  const ctf = req.ctf;
  const submission = await EventSubmission.create({
    ctfId: ctf._id,
    userId: req.user._id,
    teamId: req.body.teamId || null,
    challengeId: req.body.challengeId,
    submittedFlag: String(req.body.flag || ""),
    status: "review",
    ip: req.ip
  });

  res.status(202).json({ accepted: false, queued: true, submissionId: submission._id });
});
