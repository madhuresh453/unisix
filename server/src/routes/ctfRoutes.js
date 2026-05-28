import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  certificate,
  createCTF,
  deleteCTF,
  getCTF,
  listCTFs,
  registerForCTF,
  updateCTF
} from "../controllers/ctfController.js";
import { requireAuth, requirePermission, requireRole } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

const ctfPayloadRules = [
  body("name").trim().isLength({ min: 3 }),
  body("description").trim().isLength({ min: 20 }),
  body("startsAt").isISO8601(),
  body("endsAt").isISO8601()
];

router.get(
  "/",
  query("status").optional().isIn(["draft", "upcoming", "live", "past"]),
  query("search").optional().trim(),
  validate,
  listCTFs
);
router.get("/:ctfId", param("ctfId").trim().isLength({ min: 2 }), validate, getCTF);
router.post("/", requireAuth, requirePermission("ctfs:manage"), ctfPayloadRules, validate, createCTF);
router.put("/:ctfId", requireAuth, requirePermission("ctfs:manage"), param("ctfId").trim().isLength({ min: 2 }), validate, updateCTF);
router.delete("/:ctfId", requireAuth, requirePermission("ctfs:manage"), param("ctfId").trim().isLength({ min: 2 }), validate, deleteCTF);
router.post("/:ctfId/register", requireAuth, param("ctfId").trim().isLength({ min: 2 }), validate, registerForCTF);
router.get("/:ctfId/certificate", requireAuth, param("ctfId").trim().isLength({ min: 2 }), validate, certificate);

export default router;
