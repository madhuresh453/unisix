import { Router } from "express";
import { body, param } from "express-validator";
import {
  createNotification,
  createTeamMember,
  deleteMedia,
  deleteNotification,
  deleteTeamMember,
  getAboutSettings,
  getDashboardAnalytics,
  getHomepageSettings,
  listMedia,
  listNotifications,
  listAuditLogs,
  listTeamMembers,
  updateNotification,
  updateTeamMember,
  uploadMediaBase64,
  getGlobalSettings,
  upsertGlobalSettings,
  upsertAboutSettings,
  upsertHomepageSettings
} from "../controllers/adminController.js";
import { requireAuth, requirePermission } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.use(requireAuth, requirePermission("admin:access"));

router.get("/dashboard", getDashboardAnalytics);

router.get("/homepage", getHomepageSettings);
router.put("/homepage", upsertHomepageSettings);

router.get("/about", getAboutSettings);
router.put("/about", upsertAboutSettings);

router.get("/team-members", listTeamMembers);
router.post(
  "/team-members",
  body("name").trim().isLength({ min: 2 }),
  body("title").trim().isLength({ min: 2 }),
  body("group").isIn(["core", "developers", "researchers", "organizers"]),
  validate,
  createTeamMember
);
router.put("/team-members/:id", param("id").isMongoId(), validate, updateTeamMember);
router.delete("/team-members/:id", param("id").isMongoId(), validate, deleteTeamMember);

router.get("/notifications", listNotifications);
router.post(
  "/notifications",
  body("title").trim().isLength({ min: 2 }),
  body("message").trim().isLength({ min: 2 }),
  validate,
  createNotification
);
router.put("/notifications/:id", param("id").isMongoId(), validate, updateNotification);
router.delete("/notifications/:id", param("id").isMongoId(), validate, deleteNotification);

router.get("/media", listMedia);
router.post(
  "/media/upload-base64",
  body("filename").trim().isLength({ min: 1 }),
  body("mimeType").trim().isLength({ min: 3 }),
  body("base64").trim().isLength({ min: 10 }),
  validate,
  uploadMediaBase64
);
router.delete("/media/:id", param("id").isMongoId(), validate, deleteMedia);

router.get("/settings", getGlobalSettings);
router.put("/settings", upsertGlobalSettings);
router.get("/audit-logs", listAuditLogs);

export default router;
