import { Router } from "express";
import { getProfile, listUsers, updateProfile } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { listQueryRules } from "../utils/validators.js";

const router = Router();

router.get("/me", requireAuth, getProfile);
router.patch("/me", requireAuth, updateProfile);
router.get("/", requireAuth, requireRole("admin"), listQueryRules, validate, listUsers);

export default router;
