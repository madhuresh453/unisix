import { Router } from "express";
import { body } from "express-validator";
import { createSponsor, listSponsors } from "../controllers/sponsorController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get("/", listSponsors);
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  body("name").trim().isLength({ min: 2 }),
  validate,
  createSponsor
);

export default router;
