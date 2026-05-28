import mongoose from "mongoose";
import slugify from "slugify";
import { CTF } from "../models/CTF.js";
import { generateCertificate } from "../services/certificateService.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

function byIdOrSlug(value) {
  return mongoose.isValidObjectId(value) ? { _id: value } : { slug: value };
}

export const listCTFs = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    ...(req.query.status ? { status: req.query.status } : {}),
    ...(req.query.search ? { name: { $regex: req.query.search, $options: "i" } } : {})
  };
  const [ctfs, total] = await Promise.all([
    CTF.find(filter).sort({ startsAt: 1 }).skip(skip).limit(limit).lean(),
    CTF.countDocuments(filter)
  ]);

  res.json({ page, total, ctfs });
});

export const getCTF = asyncHandler(async (req, res) => {
  const ctf = await CTF.findOne(byIdOrSlug(req.params.ctfId))
    .populate("challenges", "title slug category difficulty currentPoints solverCount")
    .lean();

  if (!ctf) return res.status(404).json({ message: "CTF not found." });

  return res.json({ ctf });
});

export const createCTF = asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.name, { lower: true, strict: true });
  const ctf = await CTF.create({
    ...req.body,
    slug,
    createdBy: req.user._id
  });

  res.status(201).json({ ctf });
});

export const updateCTF = asyncHandler(async (req, res) => {
  const ctf = await CTF.findOneAndUpdate(byIdOrSlug(req.params.ctfId), { $set: req.body }, { new: true });
  if (!ctf) return res.status(404).json({ message: "CTF not found." });
  return res.json({ ctf });
});

export const deleteCTF = asyncHandler(async (req, res) => {
  const ctf = await CTF.findOneAndDelete(byIdOrSlug(req.params.ctfId));
  if (!ctf) return res.status(404).json({ message: "CTF not found." });
  return res.status(204).send();
});

export const registerForCTF = asyncHandler(async (req, res) => {
  const ctf = await CTF.findOne(byIdOrSlug(req.params.ctfId));

  if (!ctf) return res.status(404).json({ message: "CTF not found." });
  if (!["upcoming", "live"].includes(ctf.status)) {
    return res.status(409).json({ message: "Registration is closed." });
  }

  await CTF.updateOne(
    { _id: ctf._id },
    {
      $addToSet: {
        participants: req.user._id,
        ...(req.user.team ? { teams: req.user.team } : {})
      }
    }
  );

  return res.json({ message: "Registered for CTF.", ctfId: ctf._id });
});

export const certificate = asyncHandler(async (req, res) => {
  const ctf = await CTF.findOne(byIdOrSlug(req.params.ctfId));

  if (!ctf) return res.status(404).json({ message: "CTF not found." });

  const pdf = await generateCertificate({ userId: req.user._id, ctfId: ctf._id });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${ctf.slug}-certificate.pdf"`);
  return res.send(pdf);
});
