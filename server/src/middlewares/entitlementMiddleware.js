import { Purchase } from "../models/Purchase.js";
import { Subscription } from "../models/Subscription.js";
import { Enrollment } from "../models/Enrollment.js";
import { isAdminRole } from "../security/rbac.js";

async function hasPaidAccess(userId, itemType, itemId) {
  const now = new Date();
  const purchase = await Purchase.findOne({
    userId,
    itemType,
    itemId,
    paymentStatus: "paid",
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
  }).lean();

  if (purchase) return true;

  const sub = await Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
  }).lean();

  return Boolean(sub);
}

export function requireEnrollment(contentTypeResolver = (req) => req.params.contentType, contentIdResolver = (req) => req.params.id) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    if (isAdminRole(req.user.role)) return next();

    const contentType = contentTypeResolver(req);
    const contentId = contentIdResolver(req);
    const enrollment = await Enrollment.findOne({ userId: req.user._id, contentType, contentId }).lean();

    if (!enrollment) return res.status(403).json({ message: "Enrollment required." });

    req.enrollment = enrollment;
    return next();
  };
}

export function requirePurchase(contentTypeResolver = (req) => req.params.contentType, contentIdResolver = (req) => req.params.id) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    if (isAdminRole(req.user.role)) return next();

    const contentType = contentTypeResolver(req);
    const contentId = contentIdResolver(req);
    const ok = await hasPaidAccess(req.user._id, contentType, contentId);

    if (!ok) return res.status(403).json({ message: "Premium purchase or active subscription required." });
    return next();
  };
}

export function requirePremiumAccess(contentLoader, contentTypeResolver = (req) => req.params.contentType) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    if (isAdminRole(req.user.role)) return next();

    const content = await contentLoader(req);
    if (!content) return res.status(404).json({ message: "Content not found." });
    req.content = content;

    if (!content.premium) return next();

    const contentType = contentTypeResolver(req);
    const ok = await hasPaidAccess(req.user._id, contentType, content._id);
    if (!ok) return res.status(403).json({ message: "Premium access required." });

    return next();
  };
}
