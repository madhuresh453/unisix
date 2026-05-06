import { Router } from "express";
import { body, param, query } from "express-validator";
import { createChallenge, getChallenge, listChallenges, unlockHint } from "../controllers/challengeController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

const challengePayloadRules = [
  body("title").trim().isLength({ min: 3 }),
  body("description").trim().isLength({ min: 20 }),
  body("category").isIn(["Web", "Crypto", "Forensics", "Pwn", "Reverse", "Cloud", "OSINT", "Misc"]),
  body("difficulty").isIn(["Easy", "Medium", "Hard", "Insane"]),
  body("basePoints").isInt({ min: 1 }),
  body("flag").trim().matches(/^UNI6\{.+\}$/)
];

router.get(
  "/",
  query("category").optional().trim(),
  query("ctf").optional().isMongoId(),
  validate,
  listChallenges
);
router.get("/:challengeId", param("challengeId").trim().isLength({ min: 2 }), validate, getChallenge);
router.post("/", requireAuth, requireRole("admin"), challengePayloadRules, validate, createChallenge);
router.post(
  "/:challengeId/hints/:hintId/unlock",
  requireAuth,
  param("challengeId").trim().isLength({ min: 2 }),
  param("hintId").isMongoId(),
  validate,
  unlockHint
);

export default router;
