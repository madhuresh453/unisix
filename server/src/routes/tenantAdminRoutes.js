import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  assignEventMember,
  createEventChallenge,
  deleteEventChallenge,
  deleteEventNotification,
  deleteEventPage,
  eventAdminOverview,
  getEventConfig,
  listEventChallenges,
  listEventMembers,
  listEventNotifications,
  listEventPages,
  listEventSubmissions,
  listEventTeams,
  removeEventMember,
  updateEventChallenge,
  upsertEventConfig,
  upsertEventNotification,
  upsertEventPage
} from "../controllers/tenantAdminController.js";
import { attachCTFContext, requireCTFPermission } from "../middlewares/eventAuthMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth, attachCTFContext, requireCTFPermission("admin:panel"));

router.get("/", eventAdminOverview);
router.get("/statistics", eventAdminOverview);

router.get("/users", query("role").optional().trim(), validate, listEventMembers);
router.post("/users", body("userId").isMongoId(), body("role").trim().isLength({ min: 3 }), validate, assignEventMember);
router.delete("/users/:userId", param("userId").isMongoId(), validate, removeEventMember);

router.get("/challenges", listEventChallenges);
router.post("/challenges", body("title").trim().isLength({ min: 3 }), body("description").trim().isLength({ min: 10 }), validate, createEventChallenge);
router.put("/challenges/:challengeId", param("challengeId").isMongoId(), validate, updateEventChallenge);
router.delete("/challenges/:challengeId", param("challengeId").isMongoId(), validate, deleteEventChallenge);

router.get("/submissions", listEventSubmissions);
router.get("/teams", listEventTeams);

router.get("/notifications", listEventNotifications);
router.post("/notifications", body("title").trim().isLength({ min: 2 }), body("content").trim().isLength({ min: 2 }), validate, upsertEventNotification);
router.put("/notifications/:notificationId", param("notificationId").isMongoId(), validate, upsertEventNotification);
router.delete("/notifications/:notificationId", param("notificationId").isMongoId(), validate, deleteEventNotification);

router.get("/pages", listEventPages);
router.post("/pages", body("title").trim().isLength({ min: 2 }), body("content").trim().isLength({ min: 2 }), validate, upsertEventPage);
router.put("/pages/:pageId", param("pageId").isMongoId(), validate, upsertEventPage);
router.delete("/pages/:pageId", param("pageId").isMongoId(), validate, deleteEventPage);

router.get("/config", getEventConfig);
router.put("/config", upsertEventConfig);

router.get("/scoreboard", listEventTeams);

export default router;
