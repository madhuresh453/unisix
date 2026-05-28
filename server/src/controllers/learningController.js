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
import { Media } from "../models/Media.js";
import { asyncHandler, pagination } from "../utils/helpers.js";
import { getIO } from "../config/socket.js";
import { hasPaidAccess } from "../middlewares/entitlementMiddleware.js";

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

function normalizePricing(payload = {}) {
  const price = Number(payload.price || 0);
  const offerPrice = Number(payload.offerPrice || 0);
  const offerPercentage = price > 0 && offerPrice > 0 ? Math.round(((price - offerPrice) / price) * 100) : Number(payload.offerPercentage || 0);
  return {
    price,
    offerPrice,
    offerPercentage: Math.max(0, Math.min(100, offerPercentage)),
    offer: {
      enabled: Boolean(payload.offer?.enabled || offerPrice > 0),
      label: payload.offer?.label || (offerPrice > 0 ? "Limited-time deal" : ""),
      startsAt: payload.offer?.startsAt || null,
      endsAt: payload.offer?.endsAt || null,
      featuredDeal: Boolean(payload.offer?.featuredDeal),
      couponCompatible: payload.offer?.couponCompatible !== false
    }
  };
}

function emitLearningEvent(req, event, payload) {
  const io = getIO();
  if (io) io.to("learning:admin").emit(event, payload);
}

function listFilter(req) {
  return {
    visibility: "public",
    status: "published",
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.difficulty ? { difficulty: req.query.difficulty } : {}),
    ...(req.query.premium ? { premium: req.query.premium === "true" } : {}),
    ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {}),
    ...(req.query.tag ? { tags: req.query.tag } : {})
  };
}

function listSort(query = {}) {
  if (query.sort === "newest") return { createdAt: -1 };
  if (query.sort === "trending") return { "analytics.views": -1, activeUsers: -1 };
  return { featured: -1, createdAt: -1 };
}

export const listLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const { limit, skip, page } = pagination(req.query);
  const filter = listFilter(req);

  const [items, total] = await Promise.all([
    model.find(filter).sort(listSort(req.query)).skip(skip).limit(limit).lean(),
    model.countDocuments(filter)
  ]);

  res.json({ page, total, items: items.map((item) => sanitizePublicContent(item, req.user)) });
});

export const getLearningContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = await model.findOne({ slug: req.params.slug, visibility: { $ne: "private" } });
  if (!item) return res.status(404).json({ message: "Content not found." });
  await model.updateOne({ _id: item._id }, { $inc: { "analytics.views": 1 } }).catch(() => null);
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

  if (item.premium && !(await hasPaidAccess(req.user._id, req.params.type.slice(0, -1), item._id))) {
    return res.status(403).json({ message: "Premium access required before enrolling." });
  }

  const enrollment = await Enrollment.findOneAndUpdate(
    { userId: req.user._id, contentType: req.params.type.slice(0, -1), contentId: item._id },
    { $setOnInsert: { enrolledAt: new Date(), progress: 0, completed: false } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await model.updateOne(
    { _id: item._id },
    { $inc: { enrolledCount: 1, "analytics.enrollments": 1, "analytics.starts": 1 } }
  ).catch(() => null);
  emitLearningEvent(req, "learning:enrollment", { type: req.params.type, id: String(item._id) });

  res.status(201).json({ enrollment });
});

export const submitLearningFlag = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const item = await model.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Content not found." });
  if (!item.flags?.length) return res.status(422).json({ message: "No flagging exercise is available for this content." });

  const attempt = String(req.body.flag || "").trim();
  const matched = item.flags.find((flag) => String(flag.label || "").trim().toLowerCase() === attempt.toLowerCase());
  if (!matched) return res.status(400).json({ message: "Incorrect flag. Try again." });

  const enrollment = await Enrollment.findOneAndUpdate(
    { userId: req.user._id, contentType: req.params.type.slice(0, -1), contentId: item._id },
    { $setOnInsert: { enrolledAt: new Date(), progress: 0, completed: false } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const reward = Number(matched.points || 100);
  await Purchase.create({
    userId: req.user._id,
    itemType: req.params.type.slice(0, -1),
    itemId: item._id,
    amount: 0,
    paymentStatus: "paid",
    transactionId: `flag_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    provider: "manual",
    metadata: { source: "flag_submission", rewardPoints: reward }
  });

  await model.updateOne({ _id: item._id }, { $inc: { "analytics.completions": 1 } }).catch(() => null);
  emitLearningEvent(req, "learning:flag:solved", { type: req.params.type, id: String(item._id), reward });

  res.json({ ok: true, reward, matched });
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

  if (purchase.itemType !== "subscription" && purchase.itemId) {
    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, contentType: purchase.itemType, contentId: purchase.itemId },
      { $setOnInsert: { enrolledAt: new Date(), progress: 0, completed: false } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

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
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ...(req.query.status ? { status: req.query.status } : {}),
    ...(req.query.visibility ? { visibility: req.query.visibility } : {}),
    ...(req.query.premium ? { premium: req.query.premium === "true" } : {}),
    ...(req.query.search ? { title: { $regex: req.query.search, $options: "i" } } : {})
  };
  const [items, total] = await Promise.all([
    model.find(filter).sort(listSort(req.query)).skip(skip).limit(limit).lean(),
    model.countDocuments(filter)
  ]);
  res.json({ page, total, items });
});

export const adminCreateContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const slug = req.body.slug || slugify(req.body.title || "item", { lower: true, strict: true });
  const item = await model.create({ ...req.body, ...normalizePricing(req.body), slug, createdBy: req.user._id });
  emitLearningEvent(req, "learning:admin:created", { type: req.params.type, id: String(item._id) });
  res.status(201).json({ item });
});

export const adminUpdateContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const update = { ...req.body };
  if ("price" in req.body || "offerPrice" in req.body || "offer" in req.body) {
    Object.assign(update, normalizePricing(req.body));
  }
  const item = await model.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
  if (!item) return res.status(404).json({ message: "Content not found." });
  emitLearningEvent(req, "learning:admin:updated", { type: req.params.type, id: String(item._id) });
  res.json({ item });
});

export const adminDeleteContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  await model.findByIdAndDelete(req.params.id);
  emitLearningEvent(req, "learning:admin:deleted", { type: req.params.type, id: req.params.id });
  res.status(204).send();
});

export const adminBulkContent = asyncHandler(async (req, res) => {
  const model = pickModel(req.params.type);
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  if (!ids.length) return res.status(422).json({ message: "Select at least one item." });

  if (req.body.action === "delete") {
    const result = await model.deleteMany({ _id: { $in: ids } });
    emitLearningEvent(req, "learning:admin:bulk", { type: req.params.type, action: "delete", count: result.deletedCount });
    return res.json({ deleted: result.deletedCount });
  }

  const update = {};
  if (req.body.action === "publish") update.status = "published";
  if (req.body.action === "unpublish") update.status = "draft";
  if (req.body.action === "feature") update.featured = true;
  if (req.body.action === "unfeature") update.featured = false;
  if (req.body.action === "pricing") Object.assign(update, normalizePricing(req.body.pricing || {}));
  if (!Object.keys(update).length) return res.status(422).json({ message: "Unsupported bulk action." });

  const result = await model.updateMany({ _id: { $in: ids } }, { $set: update });
  emitLearningEvent(req, "learning:admin:bulk", { type: req.params.type, action: req.body.action, count: result.modifiedCount });
  res.json({ modified: result.modifiedCount });
});

export const adminLearningAnalytics = asyncHandler(async (req, res) => {
  const [labs, rooms, courses, workshops, purchases, enrollments] = await Promise.all([
    Lab.find({}).sort({ "analytics.views": -1 }).limit(8).select("title analytics enrolledCount activeUsers price offerPrice").lean(),
    Room.find({}).sort({ "analytics.views": -1 }).limit(8).select("title analytics activeUsers liveParticipantCount price offerPrice").lean(),
    Course.find({}).sort({ "analytics.enrollments": -1 }).limit(8).select("title analytics enrolledCount rating price offerPrice").lean(),
    Workshop.find({}).sort({ "analytics.registrations": -1 }).limit(8).select("title analytics attendeeCount seats price offerPrice").lean(),
    Purchase.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: "$itemType", revenue: { $sum: "$amount" }, purchases: { $sum: 1 } } }
    ]),
    Enrollment.aggregate([
      { $group: { _id: "$contentType", enrollments: { $sum: 1 }, avgProgress: { $avg: "$progress" }, completions: { $sum: { $cond: ["$completed", 1, 0] } } } }
    ])
  ]);

  res.json({ top: { labs, rooms, courses, workshops }, revenue: purchases, progress: enrollments });
});

export const adminListMedia = asyncHandler(async (req, res) => {
  const media = await Media.find({}).sort({ createdAt: -1 }).limit(500).lean();
  res.json({ media });
});

export const adminCreateMedia = asyncHandler(async (req, res) => {
  const allowed = ["image/png", "image/jpeg", "image/webp", "video/mp4", "application/pdf", "text/markdown", "application/zip"];
  if (!allowed.includes(req.body.mimeType)) return res.status(422).json({ message: "Unsupported media type." });
  const media = await Media.create({ ...req.body, uploadedBy: req.user._id });
  res.status(201).json({ media });
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
