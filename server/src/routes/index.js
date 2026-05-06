import { Router } from "express";
import authRoutes from "./authRoutes.js";
import challengeRoutes from "./challengeRoutes.js";
import ctfRoutes from "./ctfRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import sponsorRoutes from "./sponsorRoutes.js";
import submissionRoutes from "./submissionRoutes.js";
import userRoutes from "./userRoutes.js";
import writeupRoutes from "./writeupRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "uni6ctf-api",
    uptime: process.uptime()
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ctfs", ctfRoutes);
router.use("/challenges", challengeRoutes);
router.use("/submissions", submissionRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/writeups", writeupRoutes);
router.use("/sponsors", sponsorRoutes);

export default router;
