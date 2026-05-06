import { Router } from "express";
import { param } from "express-validator";
import {
  countryLeaderboard,
  eventLeaderboard,
  globalLeaderboard,
  teamLeaderboard
} from "../controllers/leaderboardController.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get("/global", globalLeaderboard);
router.get("/teams", teamLeaderboard);
router.get("/countries", countryLeaderboard);
router.get("/ctf/:ctfId", param("ctfId").isMongoId(), validate, eventLeaderboard);

export default router;
