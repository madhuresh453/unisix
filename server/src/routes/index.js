import { Router } from "express";
import authRoutes from "./authRoutes.js";
import challengeRoutes from "./challengeRoutes.js";
import contentRoutes from "./contentRoutes.js";
import ctfRoutes from "./ctfRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import sponsorRoutes from "./sponsorRoutes.js";
import submissionRoutes from "./submissionRoutes.js";
import userRoutes from "./userRoutes.js";
import writeupRoutes from "./writeupRoutes.js";
import adminRoutes from "./adminRoutes.js";
import { diagnosticsStatus, healthStatus } from "../controllers/opsController.js";
import tenantPublicRoutes from "./tenantPublicRoutes.js";
import tenantAdminRoutes from "./tenantAdminRoutes.js";
import learningRoutes from "./learningRoutes.js";
import engagementRoutes from "./engagementRoutes.js";

const router = Router();

router.get("/health", healthStatus);
router.get("/health/diagnostics", diagnosticsStatus);
router.get("/ops/diagnostics", diagnosticsStatus);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ctfs", ctfRoutes);
router.use("/challenges", challengeRoutes);
router.use("/submissions", submissionRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/writeups", writeupRoutes);
router.use("/sponsors", sponsorRoutes);
router.use("/content", contentRoutes);
router.use("/learning", learningRoutes);
router.use("/engagement", engagementRoutes);
router.use("/admin", adminRoutes);
router.use("/ctf/:slug", tenantPublicRoutes);
router.use("/ctf/:slug/admin", tenantAdminRoutes);

export default router;
