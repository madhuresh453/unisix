import { Router } from "express";
import { listSubmissions, mySubmissions, submitFlag } from "../controllers/submissionController.js";
import { requireAuth, requirePermission } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { submissionLimiter } from "../middlewares/rateLimiter.js";
import { submissionCooldown } from "../security/abuseGuards.js";
import { submissionRules } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, submissionLimiter, submissionCooldown, submissionRules, validate, submitFlag);
router.get("/mine", requireAuth, mySubmissions);
router.get("/", requireAuth, requirePermission("submissions:read"), listSubmissions);

export default router;
