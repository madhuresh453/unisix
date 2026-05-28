import { User } from "../models/User.js";
import { signRefreshToken, signToken } from "../utils/token.js";
import { env } from "../config/env.js";
import { toPublicUser } from "../utils/helpers.js";

function authDebug(message, payload = {}) {
  if (!env.authDebug) return;
  console.log(`[AUTH_DEBUG] ${message}`, payload);
}

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
    token: signToken(user),
    refreshToken: signRefreshToken(user)
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  authDebug("login payload keys", { keys: Object.keys({ email, password }) });

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  authDebug("user lookup result", {
    email: normalizedEmail,
    found: Boolean(user),
    userId: user?._id?.toString()
  });

  let passwordMatches = false;

  if (user) {
    passwordMatches = await user.comparePassword(password);

    // Backward-compatible path for legacy plaintext passwords; next save rehashes.
    if (!passwordMatches && user.password === password) {
      passwordMatches = true;
      user.password = password;
    }
  }

  authDebug("password compare result", { matched: passwordMatches });

  if (!user || !passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  let token;
  try {
    token = signToken(user);
    authDebug("jwt generation success", { userId: user._id.toString() });
  } catch (error) {
    authDebug("jwt generation failure", { message: error.message });
    throw error;
  }

  return {
    user: toPublicUser(user),
    token,
    refreshToken: signRefreshToken(user)
  };
}
