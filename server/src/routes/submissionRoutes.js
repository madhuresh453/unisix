import { Router } from "express";
import { listSubmissions, mySubmissions, submitFlag } from "../controllers/submissionController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { submissionLimiter } from "../middlewares/rateLimiter.js";
import { submissionRules } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, submissionLimiter, submissionRules, validate, submitFlag);
router.get("/mine", requireAuth, mySubmissions);
router.get("/", requireAuth, requireRole("admin"), listSubmissions);

export default router;
