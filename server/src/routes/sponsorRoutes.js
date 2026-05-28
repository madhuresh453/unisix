import { Router } from "express";
import { body } from "express-validator";
import { createSponsor, deleteSponsor, listSponsors, updateSponsor } from "../controllers/sponsorController.js";
import { requireAuth, requirePermission, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get("/", listSponsors);
router.post(
  "/",
  requireAuth,
  requirePermission("sponsors:manage"),
  body("name").trim().isLength({ min: 2 }),
  validate,
  createSponsor
);
router.put("/:id", requireAuth, requirePermission("sponsors:manage"), body("name").optional().trim().isLength({ min: 2 }), validate, updateSponsor);
router.delete("/:id", requireAuth, requirePermission("sponsors:manage"), validate, deleteSponsor);

export default router;
