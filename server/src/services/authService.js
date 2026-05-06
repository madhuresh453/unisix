import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";
import { toPublicUser } from "../utils/helpers.js";

export async function registerUser(payload) {
  const existing = await User.findOne({
    $or: [{ email: payload.email }, { handle: payload.handle }]
  });

  if (existing) {
    const error = new Error("Email or handle is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: payload.name,
    handle: payload.handle,
    email: payload.email,
    password: payload.password,
    country: payload.country || "IN"
  });

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}
