import slugify from "slugify";
import { Writeup } from "../models/Writeup.js";
import { asyncHandler, pagination } from "../utils/helpers.js";

export const listWriteups = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const filter = {
    status: "published",
    ...(req.query.category ? { category: req.query.category } : {}),
    ...(req.query.search ? { $text: { $search: req.query.search } } : {})
  };

  const [writeups, total] = await Promise.all([
    Writeup.find(filter)
      .populate("author", "name handle")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Writeup.countDocuments(filter)
  ]);

  res.json({ page, total, writeups });
});

export const getWriteup = asyncHandler(async (req, res) => {
  const writeup = await Writeup.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("author", "name handle")
    .populate("challenge", "title slug category")
    .lean();

  if (!writeup) return res.status(404).json({ message: "Writeup not found." });
  return res.json({ writeup });
});

export const createWriteup = asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.title, { lower: true, strict: true });
  const writeup = await Writeup.create({
    ...req.body,
    slug,
    author: req.user._id,
    status: req.body.status || "draft",
    publishedAt: req.body.status === "published" ? new Date() : undefined
  });

  res.status(201).json({ writeup });
});
