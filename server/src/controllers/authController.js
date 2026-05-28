import { loginUser, registerUser } from "../services/authService.js";
import { asyncHandler, toPublicUser } from "../utils/helpers.js";
import { trackAuthFailure } from "../security/abuseGuards.js";
import { signRefreshToken, signToken, verifyToken } from "../utils/token.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

function setRefreshCookie(res, token) {
  const secure = env.nodeEnv === "production";
  const cookie = `uni6ctf_refresh=${token}; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}; Max-Age=${60 * 60 * 24 * 30}`;
  const current = res.getHeader("Set-Cookie");
  if (!current) res.setHeader("Set-Cookie", cookie);
  else if (Array.isArray(current)) res.setHeader("Set-Cookie", [...current, cookie]);
  else res.setHeader("Set-Cookie", [current, cookie]);
}

function setAccessCookie(res, token) {
  const secure = env.nodeEnv === "production";
  const cookie = `uni6ctf_token=${token}; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}; Max-Age=${60 * 60 * 24 * 7}`;
  const current = res.getHeader("Set-Cookie");
  if (!current) res.setHeader("Set-Cookie", cookie);
  else if (Array.isArray(current)) res.setHeader("Set-Cookie", [...current, cookie]);
  else res.setHeader("Set-Cookie", [current, cookie]);
}

function clearRefreshCookie(res) {
  const secure = env.nodeEnv === "production";
  const cookie = `uni6ctf_refresh=; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}; Max-Age=0`;
  const current = res.getHeader("Set-Cookie");
  if (!current) res.setHeader("Set-Cookie", cookie);
  else if (Array.isArray(current)) res.setHeader("Set-Cookie", [...current, cookie]);
  else res.setHeader("Set-Cookie", [current, cookie]);
}

function clearAccessCookie(res) {
  const secure = env.nodeEnv === "production";
  const cookie = `uni6ctf_token=; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}; Max-Age=0`;
  const current = res.getHeader("Set-Cookie");
  if (!current) res.setHeader("Set-Cookie", cookie);
  else if (Array.isArray(current)) res.setHeader("Set-Cookie", [...current, cookie]);
  else res.setHeader("Set-Cookie", [current, cookie]);
}

function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((x) => x.trim());
  const hit = parts.find((x) => x.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : "";
}

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  setAccessCookie(res, result.token);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  try {
    const result = await loginUser(req.body);
    trackAuthFailure(req, true);
    setAccessCookie(res, result.token);
    setRefreshCookie(res, result.refreshToken);
    res.json(result);
  } catch (error) {
    trackAuthFailure(req, false);
    throw error;
  }
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = getCookie(req, "uni6ctf_refresh");
  if (!token) return res.status(401).json({ message: "Refresh token missing." });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid refresh token." });
  }

  if (payload.type !== "refresh") {
    return res.status(401).json({ message: "Invalid refresh token." });
  }

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ message: "Invalid session." });

  const nextAccess = signToken(user);
  const nextRefresh = signRefreshToken(user);
  setAccessCookie(res, nextAccess);
  setRefreshCookie(res, nextRefresh);

  return res.json({ token: nextAccess, refreshToken: nextRefresh, user: toPublicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  clearAccessCookie(res);
  clearRefreshCookie(res);
  return res.json({ ok: true });
});
