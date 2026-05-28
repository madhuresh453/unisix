import { Router } from "express";
import { AboutSettings } from "../models/AboutSettings.js";
import { HomepageSettings } from "../models/HomepageSettings.js";
import { TeamMember } from "../models/TeamMember.js";
import { asyncHandler } from "../utils/helpers.js";

const router = Router();

router.get(
  "/homepage",
  asyncHandler(async (req, res) => {
    const settings = await HomepageSettings.findOne({ key: "main" }).lean();
    res.json({ settings });
  })
);

router.get(
  "/about",
  asyncHandler(async (req, res) => {
    const settings = await AboutSettings.findOne({ key: "main" }).lean();
    res.json({ settings });
  })
);

router.get(
  "/team",
  asyncHandler(async (req, res) => {
    const members = await TeamMember.find({ active: true }).sort({ group: 1, order: 1, createdAt: 1 }).lean();
    res.json({ members });
  })
);

export default router;
