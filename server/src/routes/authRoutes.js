import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { loginRules, registerRules } from "../utils/validators.js";

const router = Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.get("/me", requireAuth, me);

export default router;
