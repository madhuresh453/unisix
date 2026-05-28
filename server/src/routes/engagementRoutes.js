import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  adminCreateLearningPath,
  adminDeleteLearningPath,
  adminEngagementAnalytics,
  adminListLearningPaths,
  adminMentorVerification,
  adminUpdateLearningPath,
  createOrUpdateMentorProfile,
  getLearningPath,
  grantXp,
  listLearningPaths,
  listMentors,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  myGamificationState,
  myNotificationPreferences,
  pushTestNotification,
  saveNotificationPreferences,
  seedActivity,
  liveActivityFeed,
  upsertMyPathProgress
} from "../controllers/engagementController.js";
import { requireAuth, requirePermission } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get("/notifications", requireAuth, listMyNotifications);
router.patch("/notifications/:id/read", requireAuth, param("id").isMongoId(), validate, markNotificationRead);
router.post("/notifications/read-all", requireAuth, markAllNotificationsRead);
router.get("/notifications/preferences", requireAuth, myNotificationPreferences);
router.put("/notifications/preferences", requireAuth, saveNotificationPreferences);
router.post("/notifications/test", requireAuth, pushTestNotification);

router.get("/activity", liveActivityFeed);
router.post("/activity/seed", requireAuth, seedActivity);

router.get("/gamification/me", requireAuth, myGamificationState);
router.post("/gamification/xp", requireAuth, body("amount").isNumeric(), validate, grantXp);

router.get("/paths", listLearningPaths);
router.get("/paths/:slug", getLearningPath);
router.put("/paths/:pathId/progress", requireAuth, param("pathId").isMongoId(), validate, upsertMyPathProgress);

router.get("/mentors", query("verified").optional().isIn(["true", "false"]), validate, listMentors);
router.put("/mentors/me", requireAuth, createOrUpdateMentorProfile);

router.get("/admin/paths", requireAuth, requirePermission("admin:access"), adminListLearningPaths);
router.post("/admin/paths", requireAuth, requirePermission("admin:access"), body("title").trim().isLength({ min: 2 }), validate, adminCreateLearningPath);
router.put("/admin/paths/:id", requireAuth, requirePermission("admin:access"), param("id").isMongoId(), validate, adminUpdateLearningPath);
router.delete("/admin/paths/:id", requireAuth, requirePermission("admin:access"), param("id").isMongoId(), validate, adminDeleteLearningPath);
router.patch("/admin/mentors/:id/verify", requireAuth, requirePermission("admin:access"), param("id").isMongoId(), validate, adminMentorVerification);
router.get("/admin/analytics", requireAuth, requirePermission("admin:access"), adminEngagementAnalytics);

export default router;
