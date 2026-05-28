import { loginUser, registerUser } from "../services/authService.js";
import { asyncHandler, toPublicUser } from "../utils/helpers.js";
import { trackAuthFailure } from "../security/abuseGuards.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  try {
    const result = await loginUser(req.body);
    trackAuthFailure(req, true);
    res.json(result);
  } catch (error) {
    trackAuthFailure(req, false);
    throw error;
  }
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});
