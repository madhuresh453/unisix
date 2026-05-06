import { Sponsor } from "../models/Sponsor.js";
import { asyncHandler } from "../utils/helpers.js";

export const listSponsors = asyncHandler(async (req, res) => {
  const sponsors = await Sponsor.find({ active: true }).sort({ weight: -1, name: 1 }).lean();
  res.json({ sponsors });
});

export const createSponsor = asyncHandler(async (req, res) => {
  const sponsor = await Sponsor.create(req.body);
  res.status(201).json({ sponsor });
});
