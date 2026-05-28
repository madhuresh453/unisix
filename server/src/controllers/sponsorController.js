import { Sponsor } from "../models/Sponsor.js";
import { asyncHandler } from "../utils/helpers.js";

export const listSponsors = asyncHandler(async (req, res) => {
  const filter = {
    ...(req.query.active ? { active: req.query.active === "true" } : { active: true }),
    ...(req.query.tier ? { tier: req.query.tier } : {}),
    ...(req.query.search ? { name: { $regex: req.query.search, $options: "i" } } : {})
  };
  const sponsors = await Sponsor.find(filter).sort({ weight: -1, name: 1 }).lean();
  res.json({ sponsors });
});

export const createSponsor = asyncHandler(async (req, res) => {
  const sponsor = await Sponsor.create(req.body);
  res.status(201).json({ sponsor });
});

export const updateSponsor = asyncHandler(async (req, res) => {
  const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!sponsor) return res.status(404).json({ message: "Sponsor not found." });
  res.json({ sponsor });
});

export const deleteSponsor = asyncHandler(async (req, res) => {
  const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
  if (!sponsor) return res.status(404).json({ message: "Sponsor not found." });
  res.status(204).send();
});
