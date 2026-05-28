import slugify from "slugify";
import { UserNotification } from "../models/UserNotification.js";
import { PlatformActivity } from "../models/PlatformActivity.js";
import { Achievement } from "../models/Achievement.js";
import { UserAchievement } from "../models/UserAchievement.js";
import { LearningPath } from "../models/LearningPath.js";
import { UserPathProgress } from "../models/UserPathProgress.js";
import { MentorProfile } from "../models/MentorProfile.js";
import { User } from "../models/User.js";
import { asyncHandler, pagination } from "../utils/helpers.js";
import { emitActivity, emitNotification } from "../config/socket.js";

function rankFromLevel(level = 1) {
  if (level < 5) return "Script Kiddie";
  if (level < 10) return "Recon Apprentice";
  if (level < 15) return "Payload Crafter";
  if (level < 20) return "Red Team Operator";
  if (level < 25) return "Exploit Engineer";
  if (level < 30) return "Threat Hunter";
  if (level < 40) return "Malware Analyst";
  return "Cyber Commander";
}

function calcLevel(xp = 0) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1);
}

export const listMyNotifications = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    userId: req.user._id,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
  };

  const [items, total, unread] = await Promise.all([
    UserNotification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserNotification.countDocuments(filter),
    UserNotification.countDocuments({ ...filter, readAt: null })
  ]);

  res.json({ page, total, unread, items });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const item = await UserNotification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Notification not found." });
  res.json({ item });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await UserNotification.updateMany({ userId: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  res.json({ ok: true });
});

export const saveNotificationPreferences = asyncHandler(async (req, res) => {
  req.user.notificationPreferences = {
    ...(req.user.notificationPreferences || {}),
    ...(req.body || {})
  };
  await req.user.save();
  res.json({ preferences: req.user.notificationPreferences || {} });
});

export const myNotificationPreferences = asyncHandler(async (req, res) => {
  res.json({ preferences: req.user.notificationPreferences || {} });
});

export const pushTestNotification = asyncHandler(async (req, res) => {
  const item = await UserNotification.create({
    userId: req.user._id,
    type: req.body.type || "xp_gained",
    title: req.body.title || "Realtime Alert",
    message: req.body.message || "You gained XP from learning activity.",
    priority: req.body.priority || "normal",
    actionUrl: req.body.actionUrl || "/dashboard/learning",
    meta: req.body.meta || {}
  });

  emitNotification(String(req.user._id), item);
  res.status(201).json({ item });
});

export const liveActivityFeed = asyncHandler(async (req, res) => {
  const { limit } = pagination(req.query);
  const items = await PlatformActivity.find({ visibility: "public" }).sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ items });
});

export const myGamificationState = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  const achievements = await UserAchievement.find({ userId: req.user._id }).populate("achievementId").sort({ createdAt: -1 }).limit(50).lean();

  const xp = user?.xp || 0;
  const level = user?.level || calcLevel(xp);
  const rank = user?.rank || rankFromLevel(level);

  res.json({
    xp,
    level,
    rank,
    streaks: user?.streaks || {},
    badges: user?.badges || [],
    achievements: achievements.map((x) => x.achievementId).filter(Boolean)
  });
});

export const grantXp = asyncHandler(async (req, res) => {
  const gain = Math.max(0, Number(req.body.amount || 0));
  req.user.xp = Number(req.user.xp || 0) + gain;
  req.user.level = calcLevel(req.user.xp);
  req.user.rank = rankFromLevel(req.user.level);
  req.user.streaks = { ...(req.user.streaks || {}), learning: Number(req.user.streaks?.learning || 0) + 1 };
  await req.user.save();

  const item = await UserNotification.create({
    userId: req.user._id,
    type: "xp_gained",
    title: `+${gain} XP Earned`,
    message: `You are now level ${req.user.level} (${req.user.rank}).`,
    priority: "normal",
    actionUrl: "/dashboard/progress"
  });

  emitNotification(String(req.user._id), item);
  const activity = await PlatformActivity.create({
    actorUserId: req.user._id,
    action: "xp.gained",
    targetType: "system",
    text: `${req.user.handle} gained ${gain} XP`,
    visibility: "public"
  });
  emitActivity(activity);
  res.json({ xp: req.user.xp, level: req.user.level, rank: req.user.rank });
});

export const listLearningPaths = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    visibility: "public",
    status: "published",
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.difficulty ? { difficulty: req.query.difficulty } : {}),
    ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {})
  };

  const [items, total] = await Promise.all([
    LearningPath.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    LearningPath.countDocuments(filter)
  ]);

  res.json({ page, total, items });
});

export const getLearningPath = asyncHandler(async (req, res) => {
  const item = await LearningPath.findOne({ slug: req.params.slug, visibility: { $ne: "private" } }).lean();
  if (!item) return res.status(404).json({ message: "Learning path not found." });
  res.json({ item });
});

export const upsertMyPathProgress = asyncHandler(async (req, res) => {
  const item = await UserPathProgress.findOneAndUpdate(
    { userId: req.user._id, pathId: req.params.pathId },
    {
      $set: {
        ...(Array.isArray(req.body.completedNodes) ? { completedNodes: req.body.completedNodes } : {}),
        ...(req.body.progress != null ? { progress: Math.max(0, Math.min(100, Number(req.body.progress))) } : {}),
        ...(req.body.mastery ? { mastery: req.body.mastery } : {}),
        ...(req.body.strengths ? { strengths: req.body.strengths } : {}),
        ...(req.body.weaknesses ? { weaknesses: req.body.weaknesses } : {}),
        ...(req.body.preferredLearningStyle ? { preferredLearningStyle: req.body.preferredLearningStyle } : {})
      },
      $setOnInsert: { completed: false }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (item.progress >= 100 && !item.completed) {
    item.completed = true;
    await item.save();
  }

  res.json({ item });
});

export const listMentors = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ...(req.query.verified ? { verified: req.query.verified === "true" } : {}),
    ...(req.query.search ? { $or: [{ headline: { $regex: req.query.search, $options: "i" } }, { specialties: req.query.search }] } : {})
  };
  const [items, total] = await Promise.all([
    MentorProfile.find(filter).populate("userId", "name handle country").sort({ verified: -1, rating: -1 }).skip(skip).limit(limit).lean(),
    MentorProfile.countDocuments(filter)
  ]);

  res.json({ page, total, items });
});

export const createOrUpdateMentorProfile = asyncHandler(async (req, res) => {
  const item = await MentorProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { ...req.body, userId: req.user._id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ item });
});

export const adminCreateLearningPath = asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.title || "learning-path", { lower: true, strict: true });
  const item = await LearningPath.create({ ...req.body, slug, createdBy: req.user._id });
  res.status(201).json({ item });
});

export const adminUpdateLearningPath = asyncHandler(async (req, res) => {
  const item = await LearningPath.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!item) return res.status(404).json({ message: "Learning path not found." });
  res.json({ item });
});

export const adminDeleteLearningPath = asyncHandler(async (req, res) => {
  await LearningPath.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const adminListLearningPaths = asyncHandler(async (req, res) => {
  const items = await LearningPath.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const adminMentorVerification = asyncHandler(async (req, res) => {
  const item = await MentorProfile.findByIdAndUpdate(
    req.params.id,
    { $set: { verified: req.body.verified === true, approvedBy: req.user._id } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Mentor profile not found." });
  res.json({ item });
});

export const adminEngagementAnalytics = asyncHandler(async (req, res) => {
  const [activeUsers, notifications, achievements, mentors] = await Promise.all([
    User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
    UserNotification.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
    UserAchievement.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } }),
    MentorProfile.countDocuments({ verified: true })
  ]);

  res.json({ analytics: { activeUsers, notifications, achievements, verifiedMentors: mentors } });
});

export const seedActivity = asyncHandler(async (req, res) => {
  const actions = [
    "completed a lab",
    "joined a workshop",
    "cleared a room",
    "earned a certificate",
    "unlocked an achievement"
  ];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const item = await PlatformActivity.create({
    actorUserId: req.user._id,
    action: "user.activity",
    targetType: "system",
    text: `${req.user.handle} ${action}`,
    visibility: "public"
  });
  emitActivity(item);
  res.status(201).json({ item });
});
