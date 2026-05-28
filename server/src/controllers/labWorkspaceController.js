import crypto from "crypto";
import { Lab } from "../models/Lab.js";
import { LabInstance } from "../models/LabInstance.js";
import { LabStage } from "../models/LabStage.js";
import { UserLabProgress } from "../models/UserLabProgress.js";
import { LabNote } from "../models/LabNote.js";
import { LabAsset } from "../models/LabAsset.js";
import { User } from "../models/User.js";
import { UserAchievement } from "../models/UserAchievement.js";
import { Achievement } from "../models/Achievement.js";
import { asyncHandler } from "../utils/helpers.js";
import { getIO } from "../config/socket.js";
import { hasPaidAccess } from "../middlewares/entitlementMiddleware.js";

function emitLabEvent(labId, event, payload) {
  const io = getIO();
  if (!io) return;
  io.to(`lab:${labId}`).emit(event, payload);
}

async function findActiveInstance(userId, labId) {
  return LabInstance.findOne({ user: userId, lab: labId, active: true, status: { $nin: ["terminated", "expired", "failed"] } }).lean();
}

async function ensurePaidAccess(req, lab) {
  if (!lab) return false;
  if (!lab.premium) return true;
  return hasPaidAccess(req.user._id, "lab", lab._id);
}

async function buildProgress(userId, labId, stages) {
  let progress = await UserLabProgress.findOne({ user: userId, lab: labId });
  if (!progress) {
    progress = await UserLabProgress.create({
      user: userId,
      lab: labId,
      currentStage: stages.length ? stages[0]._id : null,
      status: "active",
      xpEarned: 0,
      timeSpent: 0,
      resets: 0
    });
  }
  return progress;
}

function normalizeFlag(flag) {
  return String(flag || "").trim();
}

async function awardAchievement(user, lab, key, title, description, xpReward) {
  if (!user || !key) return null;
  const existing = await UserAchievement.findOne({ userId: user._id, achievementId: key });
  if (existing) return null;

  const achievement = await Achievement.findOne({ key });
  if (!achievement) return null;

  const unlocked = await UserAchievement.create({
    userId: user._id,
    achievementId: achievement._id,
    unlockedAt: new Date(),
    progress: achievement.xpReward || 100
  });

  await User.updateOne({ _id: user._id }, { $inc: { xp: achievement.xpReward || 0, points: achievement.xpReward || 0 } }).catch(() => null);
  emitLabEvent(lab._id, "lab:achievement", { labId: String(lab._id), userId: String(user._id), achievement: achievement.toObject ? achievement.toObject() : achievement });

  return unlocked;
}

export const getLabWorkspace = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to view this lab workspace." });

  const stages = await LabStage.find({ lab: lab._id, active: true }).sort({ order: 1 }).lean();
  const instance = await findActiveInstance(req.user._id, lab._id);
  const progress = await buildProgress(req.user._id, lab._id, stages);
  const notes = await LabNote.find({ user: req.user._id, lab: lab._id }).lean();
  const assets = await LabAsset.find({ lab: lab._id, active: true }).lean();
  const achievementKeys = (progress.achievements || []).slice(-5);

  res.json({
    lab,
    stages,
    progress,
    notes,
    assets,
    instance: instance || null,
    meta: {
      objectives: lab.objectives || [],
      tools: ["nmap", "gobuster", "curl", "sqlmap", "hydra", "smbclient", "bloodhound"],
      telemetry: lab.telemetry || {},
      achievementKeys
    }
  });
});

export const getLabAssets = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to view assets." });

  const assets = await LabAsset.find({ lab: lab._id, active: true }).lean();
  res.json({ assets });
});

export const unlockLabHint = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to unlock hints." });

  const stage = await LabStage.findOne({ _id: req.params.stageId, lab: lab._id });
  if (!stage) return res.status(404).json({ message: "Stage not found." });

  const hint = stage.hints.id(req.params.hintId);
  if (!hint) return res.status(404).json({ message: "Hint not found." });

  const progress = await buildProgress(req.user._id, lab._id, [stage]);
  if (progress.unlockedHints.some((hintItem) => String(hintItem.hintId) === String(hint._id))) {
    return res.json({ hint: hint.toObject(), message: "Hint already unlocked." });
  }

  if (req.user.xp < hint.cost) {
    return res.status(403).json({ message: "Not enough XP to unlock this hint." });
  }

  await User.updateOne({ _id: req.user._id }, { $inc: { xp: -hint.cost, points: -hint.cost } }).catch(() => null);
  progress.unlockedHints.push({ stage: stage._id, hintId: hint._id, cost: hint.cost, level: hint.level });
  await progress.save();

  emitLabEvent(lab._id, "lab:hint:unlock", {
    labId: String(lab._id),
    stageId: String(stage._id),
    hintId: String(hint._id),
    userId: String(req.user._id),
    cost: hint.cost,
    level: hint.level
  });

  res.json({ hint: hint.toObject(), progress });
});

export const submitLabStageFlag = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to submit a flag." });

  const stage = await LabStage.findOne({ _id: req.params.stageId, lab: lab._id });
  if (!stage) return res.status(404).json({ message: "Stage not found." });

  const normalized = normalizeFlag(req.body.flag);
  const isCorrect = stage.expectedFlags.some((flag) => normalizeFlag(flag).toLowerCase() === normalized.toLowerCase());
  const progress = await buildProgress(req.user._id, lab._id, [stage]);
  const existingFlag = progress.submittedFlags.find((entry) => String(entry.stage) === String(stage._id) && normalizeFlag(entry.flag).toLowerCase() === normalized.toLowerCase());

  if (!isCorrect) {
    const wrongEntry = { stage: stage._id, flag: normalized, correct: false, reward: 0, submittedAt: new Date() };
    progress.submittedFlags.push(wrongEntry);
    await progress.save();
    emitLabEvent(lab._id, "lab:flag:incorrect", {
      labId: String(lab._id),
      stageId: String(stage._id),
      userId: String(req.user._id),
      flag: normalized
    });
    return res.status(400).json({ message: "Incorrect flag. Keep probing the target." });
  }

  const reward = Number(stage.points || lab.xpReward || 150);
  const alreadyCompleted = progress.completedStages.some((entry) => String(entry.stage) === String(stage._id));
  const submissionEntry = { stage: stage._id, flag: normalized, correct: true, reward, submittedAt: new Date() };
  progress.submittedFlags.push(submissionEntry);

  if (!alreadyCompleted) {
    progress.completedStages.push({ stage: stage._id, completedAt: new Date(), xpEarned: reward, flags: [submissionEntry] });
    progress.xpEarned += reward;
    progress.currentStage = await LabStage.findOne({ lab: lab._id, order: { $gt: stage.order }, active: true }).sort({ order: 1 }).select("_id").lean();
    progress.currentStage = progress.currentStage?._id || null;
    if (!progress.currentStage) {
      progress.status = "completed";
    }
    await User.updateOne({ _id: req.user._id }, { $inc: { xp: reward, points: reward } }).catch(() => null);
  }

  await progress.save();
  emitLabEvent(lab._id, "lab:flag:correct", {
    labId: String(lab._id),
    stageId: String(stage._id),
    userId: String(req.user._id),
    reward,
    flag: normalized
  });

  emitLabEvent(lab._id, "lab:stage:complete", {
    labId: String(lab._id),
    stageId: String(stage._id),
    userId: String(req.user._id),
    xp: reward,
    nextStage: progress.currentStage ? String(progress.currentStage) : null
  });
  emitLabEvent(lab._id, "lab:xp:update", {
    labId: String(lab._id),
    userId: String(req.user._id),
    xp: req.user.xp + reward,
    earned: reward
  });

  if (!alreadyCompleted && stage.stageType === "recon") {
    await awardAchievement(req.user, lab, "recon-master", "Recon Master", "Complete your first recon stage without hints.", 75).catch(() => null);
  }

  res.json({ message: "Flag accepted! Stage complete.", reward, progress });
});

export const saveLabNote = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to save notes." });

  const noteData = {
    user: req.user._id,
    lab: lab._id,
    title: req.body.title || "Untitled note",
    content: req.body.content || "",
    bookmarks: Array.isArray(req.body.bookmarks) ? req.body.bookmarks : [],
    payloads: Array.isArray(req.body.payloads) ? req.body.payloads : [],
    pinned: Boolean(req.body.pinned)
  };

  let note;
  if (req.body.noteId) {
    note = await LabNote.findOneAndUpdate({ _id: req.body.noteId, user: req.user._id, lab: lab._id }, { $set: noteData }, { new: true });
  } else {
    note = await LabNote.create(noteData);
  }

  res.json({ note });
});

export const listLabNotes = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to view notes." });

  const notes = await LabNote.find({ user: req.user._id, lab: lab._id }).lean();
  res.json({ notes });
});
