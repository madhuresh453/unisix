import slugify from "slugify";
import { EventChallenge } from "../models/EventChallenge.js";
import { EventConfig } from "../models/EventConfig.js";
import { EventMember } from "../models/EventMember.js";
import { EventNotification } from "../models/EventNotification.js";
import { EventPage } from "../models/EventPage.js";
import { EventSubmission } from "../models/EventSubmission.js";
import { EventTeam } from "../models/EventTeam.js";
import { User } from "../models/User.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

export const eventAdminOverview = asyncHandler(async (req, res) => {
  const ctfId = req.ctf._id;
  const [members, challenges, submissions, teams, notifications] = await Promise.all([
    EventMember.countDocuments({ ctfId }),
    EventChallenge.countDocuments({ ctfId }),
    EventSubmission.countDocuments({ ctfId }),
    EventTeam.countDocuments({ ctfId }),
    EventNotification.countDocuments({ ctfId })
  ]);

  res.json({ ctf: req.ctf, stats: { members, challenges, submissions, teams, notifications } });
});

export const listEventMembers = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ctfId: req.ctf._id,
    ...(req.query.role ? { role: req.query.role } : {})
  };

  const [items, total] = await Promise.all([
    EventMember.find(filter).populate("userId", "name handle email role").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    EventMember.countDocuments(filter)
  ]);

  res.json({ page, total, members: items });
});

export const assignEventMember = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId).lean();
  if (!user) return res.status(404).json({ message: "User not found." });

  const member = await EventMember.findOneAndUpdate(
    { ctfId: req.ctf._id, userId: req.body.userId },
    {
      $set: {
        role: req.body.role,
        permissions: req.body.permissions || [],
        assignedBy: req.user._id
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ member });
});

export const removeEventMember = asyncHandler(async (req, res) => {
  await EventMember.deleteOne({ ctfId: req.ctf._id, userId: req.params.userId });
  res.status(204).send();
});

export const listEventChallenges = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ctfId: req.ctf._id,
    ...(req.query.visible ? { visible: req.query.visible === "true" } : {}),
    ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {})
  };

  const [items, total] = await Promise.all([
    EventChallenge.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    EventChallenge.countDocuments(filter)
  ]);

  res.json({ page, total, challenges: items });
});

export const createEventChallenge = asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.title, { lower: true, strict: true });
  const challenge = await EventChallenge.create({
    ...req.body,
    slug,
    ctfId: req.ctf._id,
    author: req.user._id
  });
  res.status(201).json({ challenge });
});

export const updateEventChallenge = asyncHandler(async (req, res) => {
  const challenge = await EventChallenge.findOneAndUpdate(
    { _id: req.params.challengeId, ctfId: req.ctf._id },
    { $set: req.body },
    { new: true }
  );
  if (!challenge) return res.status(404).json({ message: "Challenge not found." });
  res.json({ challenge });
});

export const deleteEventChallenge = asyncHandler(async (req, res) => {
  await EventChallenge.deleteOne({ _id: req.params.challengeId, ctfId: req.ctf._id });
  res.status(204).send();
});

export const listEventSubmissions = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ctfId: req.ctf._id,
    ...(req.query.challengeId ? { challengeId: req.query.challengeId } : {}),
    ...(req.query.userId ? { userId: req.query.userId } : {}),
    ...(req.query.status ? { status: req.query.status } : {})
  };

  const [items, total] = await Promise.all([
    EventSubmission.find(filter)
      .populate("userId", "handle email")
      .populate("challengeId", "title category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    EventSubmission.countDocuments(filter)
  ]);

  res.json({ page, total, submissions: items });
});

export const listEventTeams = asyncHandler(async (req, res) => {
  const teams = await EventTeam.find({ ctfId: req.ctf._id }).sort({ score: -1, createdAt: 1 }).lean();
  res.json({ teams });
});

export const upsertEventNotification = asyncHandler(async (req, res) => {
  if (req.params.notificationId) {
    const notification = await EventNotification.findOneAndUpdate(
      { _id: req.params.notificationId, ctfId: req.ctf._id },
      { $set: req.body },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    return res.json({ notification });
  }

  const notification = await EventNotification.create({ ...req.body, ctfId: req.ctf._id, createdBy: req.user._id });
  return res.status(201).json({ notification });
});

export const listEventNotifications = asyncHandler(async (req, res) => {
  const notifications = await EventNotification.find({ ctfId: req.ctf._id }).sort({ createdAt: -1 }).lean();
  res.json({ notifications });
});

export const deleteEventNotification = asyncHandler(async (req, res) => {
  await EventNotification.deleteOne({ _id: req.params.notificationId, ctfId: req.ctf._id });
  res.status(204).send();
});

export const listEventPages = asyncHandler(async (req, res) => {
  const pages = await EventPage.find({ ctfId: req.ctf._id }).sort({ createdAt: -1 }).lean();
  res.json({ pages });
});

export const upsertEventPage = asyncHandler(async (req, res) => {
  if (req.params.pageId) {
    const page = await EventPage.findOneAndUpdate({ _id: req.params.pageId, ctfId: req.ctf._id }, { $set: req.body }, { new: true });
    if (!page) return res.status(404).json({ message: "Page not found." });
    return res.json({ page });
  }

  const slug = req.body.slug || slugify(req.body.title, { lower: true, strict: true });
  const page = await EventPage.create({ ...req.body, slug, ctfId: req.ctf._id });
  return res.status(201).json({ page });
});

export const deleteEventPage = asyncHandler(async (req, res) => {
  await EventPage.deleteOne({ _id: req.params.pageId, ctfId: req.ctf._id });
  res.status(204).send();
});

export const getEventConfig = asyncHandler(async (req, res) => {
  const config = await EventConfig.findOne({ ctfId: req.ctf._id }).lean();
  res.json({ config });
});

export const upsertEventConfig = asyncHandler(async (req, res) => {
  const config = await EventConfig.findOneAndUpdate(
    { ctfId: req.ctf._id },
    { $set: req.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ config });
});
