import { Router } from "express";
import { body, param, query } from "express-validator";
import { createWriteup, getWriteup, listWriteups } from "../controllers/writeupController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";

const router = Router();

router.get(
  "/",
  query("category").optional().trim(),
  query("search").optional().trim().isLength({ max: 80 }),
  validate,
  listWriteups
);
router.get("/:slug", param("slug").trim().isLength({ min: 2 }), validate, getWriteup);
router.post(
  "/",
  requireAuth,
  body("title").trim().isLength({ min: 3 }),
  body("excerpt").trim().isLength({ min: 10 }),
  body("content").trim().isLength({ min: 50 }),
  body("category").trim().isLength({ min: 2 }),
  validate,
  createWriteup
);

export default router;
