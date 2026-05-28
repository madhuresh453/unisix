import { Router } from "express";
import { body, param } from "express-validator";
import {
  eventScoreboard,
  getPublicEvent,
  listPublicChallenges,
  listPublicNotifications,
  listPublicPages,
  submitEventFlag
} from "../controllers/tenantPublicController.js";
import { attachCTFContext } from "../middlewares/eventAuthMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", getPublicEvent);
router.get("/challenges", attachCTFContext, listPublicChallenges);
router.get("/scoreboard", attachCTFContext, eventScoreboard);
router.get("/pages", attachCTFContext, listPublicPages);
router.get("/notifications", attachCTFContext, listPublicNotifications);
router.post("/submit", requireAuth, attachCTFContext, body("challengeId").isMongoId(), body("flag").trim().isLength({ min: 1 }), validate, submitEventFlag);

export default router;
