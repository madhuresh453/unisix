import { Router } from "express";
import { body, param } from "express-validator";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/errorMiddleware.js";
import { requirePremiumAccess } from "../middlewares/entitlementMiddleware.js";
import { Lab } from "../models/Lab.js";
import {
  deployLabInstance,
  getLabInstanceStatus,
  resetLabInstance,
  terminateLabInstance,
  extendLabInstance
} from "../controllers/labController.js";
import {
  getLabWorkspace,
  getLabAssets,
  unlockLabHint,
  submitLabStageFlag,
  saveLabNote,
  listLabNotes
} from "../controllers/labWorkspaceController.js";

const router = Router();

router.post(
  "/:id/deploy",
  requireAuth,
  param("id").isMongoId(),
  body("durationMinutes").optional().isInt({ min: 5, max: 720 }),
  validate,
  requirePremiumAccess((req) => Lab.findById(req.params.id).lean(), () => "lab"),
  deployLabInstance
);

router.get("/:id/status", requireAuth, param("id").isMongoId(), validate, getLabInstanceStatus);
router.post("/:id/reset", requireAuth, param("id").isMongoId(), validate, resetLabInstance);
router.post("/:id/terminate", requireAuth, param("id").isMongoId(), validate, terminateLabInstance);
router.post(
  "/:id/extend",
  requireAuth,
  param("id").isMongoId(),
  body("minutes").optional().isInt({ min: 5, max: 720 }),
  validate,
  extendLabInstance
);

router.get("/:id/workspace", requireAuth, param("id").isMongoId(), validate, getLabWorkspace);
router.get("/:id/assets", requireAuth, param("id").isMongoId(), validate, getLabAssets);
router.post(
  "/:id/stages/:stageId/hints/:hintId/unlock",
  requireAuth,
  param("id").isMongoId(),
  param("stageId").isMongoId(),
  param("hintId").isMongoId(),
  validate,
  unlockLabHint
);
router.post(
  "/:id/stages/:stageId/flags",
  requireAuth,
  param("id").isMongoId(),
  param("stageId").isMongoId(),
  body("flag").trim().isLength({ min: 5 }),
  validate,
  submitLabStageFlag
);
router.post("/:id/notes", requireAuth, body("noteId").optional().isMongoId(), body("title").trim().isLength({ min: 1 }), body("content").trim().isLength({ min: 1 }), validate, saveLabNote);
router.get("/:id/notes", requireAuth, param("id").isMongoId(), validate, listLabNotes);

export default router;
