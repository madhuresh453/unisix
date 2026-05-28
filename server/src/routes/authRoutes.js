import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { authBruteforceGuard } from "../security/abuseGuards.js";
import { loginRules, registerRules } from "../utils/validators.js";

const router = Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, authBruteforceGuard, loginRules, validate, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/refresh", refresh);

export default router;
