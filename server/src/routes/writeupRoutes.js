import { Router } from "express";
import { body, param, query } from "express-validator";
import { createWriteup, deleteWriteup, getWriteup, listWriteups, updateWriteup } from "../controllers/writeupController.js";
import { requireAuth, requirePermission } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get(
  "/",
  query("category").optional().trim(),
  query("status").optional().trim(),
  query("search").optional().trim().isLength({ max: 80 }),
  validate,
  listWriteups
);
router.get("/:slug", param("slug").trim().isLength({ min: 2 }), validate, getWriteup);
router.post(
  "/",
  requireAuth,
  requirePermission("writeups:manage"),
  body("title").trim().isLength({ min: 3 }),
  body("excerpt").trim().isLength({ min: 10 }),
  body("content").trim().isLength({ min: 50 }),
  body("category").trim().isLength({ min: 2 }),
  validate,
  createWriteup
);
router.put("/:id", requireAuth, requirePermission("writeups:manage"), param("id").isMongoId(), validate, updateWriteup);
router.delete("/:id", requireAuth, requirePermission("writeups:manage"), param("id").isMongoId(), validate, deleteWriteup);

export default router;
