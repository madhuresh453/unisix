import mongoose from "mongoose";
import slugify from "slugify";
import { Challenge } from "../models/Challenge.js";
import { CTF } from "../models/CTF.js";
import { createFlagHash } from "../services/scoringService.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

function challengeFilter(value) {
  return mongoose.isValidObjectId(value) ? { _id: value } : { slug: value };
}

export const listChallenges = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    isPublished: req.user?.role === "admin" ? { $in: [true, false] } : true,
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.ctf ? { ctf: req.query.ctf } : {})
  };

  const [challenges, total] = await Promise.all([
    Challenge.find(filter)
      .select("-flagHash -flagSalt")
      .sort({ category: 1, currentPoints: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Challenge.countDocuments(filter)
  ]);

  res.json({ page, total, challenges });
});

export const getChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findOne(challengeFilter(req.params.challengeId))
    .select("-flagHash -flagSalt")
    .populate("ctf", "name slug status startsAt endsAt")
    .lean();

  if (!challenge) return res.status(404).json({ message: "Challenge not found." });
  return res.json({ challenge });
});

export const createChallenge = asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.title, { lower: true, strict: true });
  const { flagHash, flagSalt } = createFlagHash(req.body.flag);

  const challenge = await Challenge.create({
    title: req.body.title,
    slug,
    description: req.body.description,
    category: req.body.category,
    difficulty: req.body.difficulty,
    basePoints: req.body.basePoints,
    currentPoints: req.body.basePoints,
    flagHash,
    flagSalt,
    ctf: req.body.ctf,
    author: req.body.author || req.user.handle,
    tags: req.body.tags || [],
    hints: req.body.hints || [],
    attachments: req.body.attachments || [],
    isPublished: Boolean(req.body.isPublished)
  });

  if (challenge.ctf) {
    await CTF.updateOne({ _id: challenge.ctf }, { $addToSet: { challenges: challenge._id } });
  }

  res.status(201).json({ challenge: sanitizeChallenge(challenge) });
});

export const unlockHint = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findOne(challengeFilter(req.params.challengeId)).select("-flagHash -flagSalt");

  if (!challenge) return res.status(404).json({ message: "Challenge not found." });

  const hint = challenge.hints.id(req.params.hintId);
  if (!hint) return res.status(404).json({ message: "Hint not found." });

  const alreadyUnlocked = req.user.unlockedHints.some(
    (item) => item.challenge.toString() === challenge._id.toString() && item.hintId === hint._id.toString()
  );

  if (!alreadyUnlocked) {
    req.user.unlockedHints.push({
      challenge: challenge._id,
      hintId: hint._id.toString(),
      cost: hint.cost
    });
    req.user.score = Math.max(0, req.user.score - hint.cost);
    req.user.points = Math.max(0, req.user.points - hint.cost);
    await req.user.save();
  }

  res.json({
    hint: {
      id: hint._id,
      title: hint.title,
      body: hint.body,
      cost: hint.cost
    },
    score: req.user.score
  });
});

function sanitizeChallenge(challenge) {
  const object = challenge.toObject ? challenge.toObject() : challenge;
  delete object.flagHash;
  delete object.flagSalt;
  return object;
}
