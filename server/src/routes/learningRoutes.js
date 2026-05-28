import { Router } from "express";
import { body, param } from "express-validator";
import {
  adminCreateContent,
  adminDeleteContent,
  adminFinancials,
  adminListCertificates,
  adminListContent,
  adminListPayments,
  adminListSubscriptions,
  adminUpdateContent,
  confirmPurchase,
  createPurchaseIntent,
  enrollLearningContent,
  getFullLearningContent,
  getLearningContent,
  getMyLearningDashboard,
  issueCertificate,
  listLearningContent,
  paymentWebhook,
  subscribePlan,
  updateEnrollmentProgress,
  verifyCertificate
} from "../controllers/learningController.js";
import { requireAuth, requirePermission } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { requirePremiumAccess } from "../middlewares/entitlementMiddleware.js";
import { Course } from "../models/Course.js";
import { Lab } from "../models/Lab.js";
import { Room } from "../models/Room.js";
import { Workshop } from "../models/Workshop.js";

const router = Router();
const modelByType = { labs: Lab, rooms: Room, courses: Course, workshops: Workshop };
const singularByType = { labs: "lab", rooms: "room", courses: "course", workshops: "workshop" };

router.get("/:type(labs|rooms|courses|workshops)", listLearningContent);
router.get("/:type(labs|rooms|courses|workshops)/slug/:slug", getLearningContent);
router.get(
  "/:type(labs|rooms|courses|workshops)/:id/full",
  requireAuth,
  param("id").isMongoId(),
  validate,
  requirePremiumAccess(
    (req) => modelByType[req.params.type].findById(req.params.id).lean(),
    (req) => singularByType[req.params.type]
  ),
  getFullLearningContent
);

router.post("/:type(labs|rooms|courses|workshops)/:id/enroll", requireAuth, param("id").isMongoId(), validate, enrollLearningContent);

router.get("/me/dashboard", requireAuth, getMyLearningDashboard);
router.patch("/me/enrollments/:enrollmentId", requireAuth, param("enrollmentId").isMongoId(), body("progress").optional().isFloat({ min: 0, max: 100 }), validate, updateEnrollmentProgress);

router.post("/payments/intent", requireAuth, body("itemType").isIn(["lab", "room", "course", "workshop", "subscription"]), body("amount").isFloat({ min: 0 }), validate, createPurchaseIntent);
router.post("/payments/:purchaseId/confirm", requireAuth, param("purchaseId").isMongoId(), validate, confirmPurchase);
router.post("/payments/webhook", paymentWebhook);
router.post("/subscriptions", requireAuth, body("plan").optional().isIn(["free", "premium", "pro", "enterprise"]), validate, subscribePlan);

router.post("/certificates", requireAuth, issueCertificate);
router.get("/certificates/verify/:certificateId", verifyCertificate);

router.get("/admin/:type(labs|rooms|courses|workshops)", requireAuth, requirePermission("admin:access"), adminListContent);
router.post("/admin/:type(labs|rooms|courses|workshops)", requireAuth, requirePermission("admin:access"), body("title").trim().isLength({ min: 2 }), validate, adminCreateContent);
router.put("/admin/:type(labs|rooms|courses|workshops)/:id", requireAuth, requirePermission("admin:access"), param("id").isMongoId(), validate, adminUpdateContent);
router.delete("/admin/:type(labs|rooms|courses|workshops)/:id", requireAuth, requirePermission("admin:access"), param("id").isMongoId(), validate, adminDeleteContent);
router.get("/admin/financials/overview", requireAuth, requirePermission("admin:access"), adminFinancials);
router.get("/admin/certificates", requireAuth, requirePermission("admin:access"), adminListCertificates);
router.get("/admin/payments", requireAuth, requirePermission("admin:access"), adminListPayments);
router.get("/admin/subscriptions", requireAuth, requirePermission("admin:access"), adminListSubscriptions);

export default router;
