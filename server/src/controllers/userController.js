import { User } from "../models/User.js";
import { asyncHandler, pagination, toPublicUser } from "../utils/helpers.js";

export const getProfile = asyncHandler(async (req, res) => {
  await req.user.populate("team", "name slug country");
  res.json({ user: toPublicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "country", "bio"];
  for (const field of allowed) {
    if (field in req.body) req.user[field] = req.body[field];
  }

  req.user.profileCompleted = Boolean(req.user.name && req.user.country);
  await req.user.save();

  res.json({ user: toPublicUser(req.user) });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { limit, skip, page } = pagination(req.query);
  const [users, total] = await Promise.all([
    User.find({}).sort({ score: -1 }).skip(skip).limit(limit).populate("team", "name").lean(),
    User.countDocuments()
  ]);

  res.json({
    page,
    total,
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      handle: user.handle,
      role: user.role,
      country: user.country,
      score: user.score,
      team: user.team?.name
    }))
  });
});
