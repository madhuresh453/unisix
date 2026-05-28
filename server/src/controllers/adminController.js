import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AboutSettings } from "../models/AboutSettings.js";
import { Challenge } from "../models/Challenge.js";
import { CTF } from "../models/CTF.js";
import { HomepageSettings } from "../models/HomepageSettings.js";
import { Leaderboard } from "../models/Leaderboard.js";
import { Media } from "../models/Media.js";
import { Notification } from "../models/Notification.js";
import { GlobalSettings } from "../models/GlobalSettings.js";
import { AuditLog } from "../models/AuditLog.js";
import { Sponsor } from "../models/Sponsor.js";
import { Submission } from "../models/Submission.js";
import { Team } from "../models/Team.js";
import { TeamMember } from "../models/TeamMember.js";
import { User } from "../models/User.js";
import { Writeup } from "../models/Writeup.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/helpers.js";
import { CTFEvent } from "../models/CTFEvent.js";
import { EventMember } from "../models/EventMember.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed"
]);

function normalizeBase64(input = "") {
  return String(input).replace(/^data:[^;]+;base64,/, "");
}

async function uploadToCloudinary({ fileDataUri, folder, filename }) {
  const form = new FormData();
  form.append("file", fileDataUri);
  form.append("folder", folder);
  form.append("public_id", filename.replace(/\.[^/.]+$/, ""));

  if (env.cloudinaryUploadPreset) {
    form.append("upload_preset", env.cloudinaryUploadPreset);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/auto/upload`;
  const response = await fetch(endpoint, { method: "POST", body: form });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${details || response.status}`);
  }
  return response.json();
}

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [users, challenges, ctfs, writeups, sponsors, teams, submissions, leaderboards] = await Promise.all([
    User.countDocuments(),
    Challenge.countDocuments(),
    CTF.countDocuments(),
    Writeup.countDocuments(),
    Sponsor.countDocuments(),
    Team.countDocuments(),
    Submission.countDocuments(),
    Leaderboard.countDocuments()
  ]);

  res.json({
    analytics: { users, challenges, ctfs, writeups, sponsors, teams, submissions, leaderboards }
  });
});

export const getHomepageSettings = asyncHandler(async (req, res) => {
  const settings = await HomepageSettings.findOne({ key: "main" }).lean();
  res.json({ settings });
});

export const upsertHomepageSettings = asyncHandler(async (req, res) => {
  const settings = await HomepageSettings.findOneAndUpdate(
    { key: "main" },
    { $set: req.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ settings });
});

export const getAboutSettings = asyncHandler(async (req, res) => {
  const settings = await AboutSettings.findOne({ key: "main" }).lean();
  res.json({ settings });
});

export const upsertAboutSettings = asyncHandler(async (req, res) => {
  const settings = await AboutSettings.findOneAndUpdate(
    { key: "main" },
    { $set: req.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ settings });
});

export const listTeamMembers = asyncHandler(async (req, res) => {
  const filter = {
    ...(req.query.group ? { group: req.query.group } : {}),
    ...(req.query.active ? { active: req.query.active === "true" } : {})
  };
  const members = await TeamMember.find(filter).sort({ group: 1, order: 1, createdAt: 1 }).lean();
  res.json({ members });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.create(req.body);
  res.status(201).json({ member });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!member) return res.status(404).json({ message: "Team member not found." });
  res.json({ member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ message: "Team member not found." });
  res.status(204).send();
});

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
  res.json({ notifications });
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json({ notification });
});

export const updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  res.json({ notification });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  res.status(204).send();
});

export const listMedia = asyncHandler(async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 }).lean();
  res.json({ media });
});

export const uploadMediaBase64 = asyncHandler(async (req, res) => {
  const { filename, mimeType, base64 } = req.body;

  if (!filename || !mimeType || !base64) {
    return res.status(422).json({ message: "filename, mimeType, and base64 are required." });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return res.status(422).json({ message: "Unsupported file type." });
  }

  const cleanedName = String(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = `${Date.now()}-${cleanedName}`;
  const fileBuffer = Buffer.from(normalizeBase64(base64), "base64");
  let url = `/uploads/${uniqueName}`;
  let publicId = "";

  const canUseCloudinary = Boolean(env.cloudinaryCloudName) && Boolean(env.cloudinaryUploadPreset);
  if (canUseCloudinary) {
    const result = await uploadToCloudinary({
      fileDataUri: `data:${mimeType};base64,${normalizeBase64(base64)}`,
      folder: env.cloudinaryFolder,
      filename: uniqueName
    });
    url = result.secure_url;
    publicId = result.public_id || "";
  } else {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, fileBuffer);
  }

  const media = await Media.create({
    filename: uniqueName,
    originalName: filename,
    mimeType,
    size: fileBuffer.length,
    url,
    publicId,
    uploadedBy: req.user?._id
  });

  res.status(201).json({ media });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) return res.status(404).json({ message: "Media not found." });

  if (!media.publicId) {
    const filePath = path.join(uploadDir, media.filename);
    await fs.unlink(filePath).catch(() => null);
  }

  res.status(204).send();
});

export const getGlobalSettings = asyncHandler(async (req, res) => {
  const settings = await GlobalSettings.findOne({ key: "main" }).lean();
  res.json({ settings });
});

export const upsertGlobalSettings = asyncHandler(async (req, res) => {
  const settings = await GlobalSettings.findOneAndUpdate(
    { key: "main" },
    { $set: req.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ settings });
});

export const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ logs });
});

export const listCTFEvents = asyncHandler(async (req, res) => {
  const events = await CTFEvent.find({}).sort({ createdAt: -1 }).lean();
  res.json({ events });
});

export const createCTFEvent = asyncHandler(async (req, res) => {
  const event = await CTFEvent.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ event });
});

export const updateCTFEvent = asyncHandler(async (req, res) => {
  const event = await CTFEvent.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!event) return res.status(404).json({ message: "CTF event not found." });
  res.json({ event });
});

export const deleteCTFEvent = asyncHandler(async (req, res) => {
  await CTFEvent.findByIdAndDelete(req.params.id);
  await EventMember.deleteMany({ ctfId: req.params.id });
  res.status(204).send();
});

export const assignCTFAdmin = asyncHandler(async (req, res) => {
  const event = await CTFEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "CTF event not found." });

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).json({ message: "User not found." });

  const role = req.body.role || "ctf_admin";
  await EventMember.findOneAndUpdate(
    { ctfId: event._id, userId: user._id },
    {
      $set: {
        role,
        permissions: req.body.permissions || [],
        assignedBy: req.user._id
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (role === "ctf_admin") {
    await CTFEvent.updateOne({ _id: event._id }, { $addToSet: { admins: user._id } });
  }

  res.json({ ok: true });
});
