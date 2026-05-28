import crypto from "crypto";
import slugify from "slugify";
import { Lab } from "../models/Lab.js";
import { Room } from "../models/Room.js";
import { Course } from "../models/Course.js";
import { Workshop } from "../models/Workshop.js";
import { Enrollment } from "../models/Enrollment.js";
import { Purchase } from "../models/Purchase.js";
import { Certificate } from "../models/Certificate.js";
import { Subscription } from "../models/Subscription.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

const MODELS = {
  labs: Lab,
  rooms: Room,
  courses: Course,
  workshops: Workshop
};

function pickModel(type) {
  const model = MODELS[type];
  if (!model) {
    const error = new Error("Unsupported content type.");
    error.statusCode = 422;
    throw error;
  }
  return model;
}

function sanitizePublicContent(item, user) {
  if (!item) return null;
  const obj = item.toObject ? item.toObject() : item;
  const canViewPremium = Boolean(user && (user.role === "super_admin" || user.role === "admin"));
  if (!obj.premium || canViewPremium) return obj;

  return {
    ...obj,
    walkthrough: "",
    writeup: "",
    downloadableFiles: [],
    meetingLink: "",
    recordings: [],
    resources: (obj.resources || []).slice(0, 2),
    modules: Array.isArray(obj.modules)
      ? obj.modules.map((module) => ({
          ...module,
          lessons: (module.lessons || []).map((lesson) => ({
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration,
            preview: lesson.preview,
            content: lesson.preview ? lesson.content : ""
          }))
        }))
      : obj.modules
  };
}

function listFilter(req) {
  return {
    visibility: "public",
    status: "published",
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.difficulty ? { difficulty: req.query.difficulty } : {}),
    ...(req.query.premium ? { premium: req.query.premium === "true" } : {}),
    ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {})
  };
}

export const listLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const { limit, skip, page } = pagination(req.query);
  const filter = listFilter(req);

  const [items, total] = await Promise.all([
    model.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    model.countDocuments(filter)
  ]);

  res.json({ page, total, items: items.map((item) => sanitizePublicContent(item, req.user)) });
});

export const getLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = await model.findOne({ slug: req.params.slug, visibility: { $ne: "private" } });
  if (!item) return res.status(404).json({ message: "Content not found." });
  res.json({ item: sanitizePublicContent(item, req.user) });
});

export const getFullLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = req.content || (await model.findById(req.params.id));
  if (!item) return res.status(404).json({ message: "Content not found." });
  res.json({ item });
});

export const enrollLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = await model.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Content not found." });

  const enrollment = await Enrollment.findOneAndUpdate(
    { userId: req.user._id, contentType: req.params.type.slice(0, -1), contentId: item._id },
    { $setOnInsert: { enrolledAt: new Date(), progress: 0, completed: false } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ enrollment });
});

export const updateEnrollmentProgress = asyncHandler(async (req, res) => {
  const progress = Math.max(0, Math.min(100, Number(req.body.progress || 0)));
  const enrollment = await Enrollment.findOneAndUpdate(
    {
      _id: req.params.enrollmentId,
      userId: req.user._id
    },
    {
      $set: {
        progress,
        completed: progress >= 100,
        lastViewedAt: new Date(),
        ...(Array.isArray(req.body.bookmarks) ? { bookmarks: req.body.bookmarks } : {}),
        ...(Array.isArray(req.body.notes) ? { notes: req.body.notes } : {})
      }
    },
    { new: true }
  );

  if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
  res.json({ enrollment });
});

export const getMyLearningDashboard = asyncHandler(async (req, res) => {
  const [enrollments, purchases, certificates, subscriptions] = await Promise.all([
    Enrollment.find({ userId: req.user._id }).sort({ updatedAt: -1 }).lean(),
    Purchase.find({ userId: req.user._id, paymentStatus: "paid" }).sort({ createdAt: -1 }).lean(),
    Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 }).lean(),
    Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean()
  ]);

  const completed = enrollments.filter((e) => e.completed).length;
  const streak = enrollments.length ? 1 : 0;

  res.json({
    stats: {
      enrolled: enrollments.length,
      completed,
      activeLabs: enrollments.filter((e) => e.contentType === "lab" && !e.completed).length,
      completedRooms: enrollments.filter((e) => e.contentType === "room" && e.completed).length,
      certificates: certificates.length,
      purchases: purchases.length,
      streak,
      xp: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0)
    },
    enrollments,
    purchases,
    certificates,
    subscriptions,
    recommendations: enrollments.slice(0, 5),
    recentlyViewed: enrollments.filter((e) => e.lastViewedAt).slice(0, 10)
  });
});

export const createPurchaseIntent = asyncHandler(async (req, res) => {
  const { itemType, itemId, amount, provider = "manual" } = req.body;
  const purchase = await Purchase.create({
    userId: req.user._id,
    itemType,
    itemId: itemId || null,
    amount: Number(amount || 0),
    provider,
    paymentStatus: "pending",
    transactionId: `txn_${crypto.randomBytes(8).toString("hex")}`
  });

  res.status(201).json({ purchase, checkout: { provider, transactionId: purchase.transactionId } });
});

export const confirmPurchase = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findOne({ _id: req.params.purchaseId, userId: req.user._id });
  if (!purchase) return res.status(404).json({ message: "Purchase not found." });

  const durationDays = Number(req.body.durationDays || 0);
  purchase.paymentStatus = "paid";
  purchase.unlockedAt = new Date();
  purchase.expiresAt = durationDays > 0 ? new Date(Date.now() + durationDays * 86400000) : null;
  await purchase.save();

  res.json({ purchase });
});

export const paymentWebhook = asyncHandler(async (req, res) => {
  const transactionId = req.body.transactionId || req.body.eventId;
  if (!transactionId) return res.status(400).json({ message: "Missing transaction reference." });

  const purchase = await Purchase.findOne({ transactionId });
  if (!purchase) return res.status(404).json({ message: "Purchase not found." });

  if (req.body.status === "paid") {
    purchase.paymentStatus = "paid";
    purchase.unlockedAt = new Date();
    await purchase.save();
  }

  res.json({ ok: true });
});

export const subscribePlan = asyncHandler(async (req, res) => {
  const { plan = "premium", provider = "manual", durationDays = 30 } = req.body;
  const sub = await Subscription.create({
    userId: req.user._id,
    plan,
    provider,
    status: "active",
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + Number(durationDays) * 86400000),
    features: plan === "enterprise" ? ["all_access", "team_reporting"] : ["premium_access"]
  });

  res.status(201).json({ subscription: sub });
});

export const issueCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.create({
    userId: req.user._id,
    courseId: req.body.courseId || null,
    workshopId: req.body.workshopId || null,
    certificateId: `UNI6-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    verificationCode: crypto.randomBytes(8).toString("hex"),
    downloadablePdf: req.body.downloadablePdf || ""
  });

  res.status(201).json({ certificate: cert });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findOne({ certificateId: req.params.certificateId }).lean();
  if (!cert) return res.status(404).json({ message: "Certificate not found." });
  res.json({ certificate: cert, valid: true });
});

export const adminListContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const items = await model.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const adminCreateContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const slug = req.body.slug || slugify(req.body.title || "item", { lower: true, strict: true });
  const item = await model.create({ ...req.body, slug, createdBy: req.user._id });
  res.status(201).json({ item });
});

export const adminUpdateContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = await model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!item) return res.status(404).json({ message: "Content not found." });
  res.json({ item });
});

export const adminDeleteContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  await model.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const adminFinancials = asyncHandler(async (req, res) => {
  const [purchases, subscriptions] = await Promise.all([
    Purchase.find({}).sort({ createdAt: -1 }).limit(200).lean(),
    Subscription.find({}).sort({ createdAt: -1 }).limit(200).lean()
  ]);
  res.json({ purchases, subscriptions });
});

export const adminListCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({}).sort({ issuedAt: -1 }).limit(500).lean();
  res.json({ certificates });
});

export const adminListPayments = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({}).sort({ createdAt: -1 }).limit(500).lean();
  res.json({ purchases });
});

export const adminListSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({}).sort({ createdAt: -1 }).limit(500).lean();
  res.json({ subscriptions });
});
