import { env } from "../config/env.js";

const authFailures = new Map();
const submissionCooldowns = new Map();

function now() {
  return Date.now();
}

export function authBruteforceGuard(req, res, next) {
  const key = `${req.ip}:${String(req.body?.email || "").toLowerCase()}`;
  const state = authFailures.get(key);

  if (state && state.count >= env.authFailureLimit && now() - state.firstSeenAt < env.authFailureWindowMs) {
    return res.status(429).json({ message: "Too many failed login attempts. Try again later." });
  }

  res.locals.authThrottleKey = key;
  return next();
}

export function trackAuthFailure(req, success) {
  const key = resLocalsKey(req);
  if (!key) return;

  if (success) {
    authFailures.delete(key);
    return;
  }

  const existing = authFailures.get(key);
  if (!existing || now() - existing.firstSeenAt >= env.authFailureWindowMs) {
    authFailures.set(key, { count: 1, firstSeenAt: now() });
    return;
  }

  existing.count += 1;
  authFailures.set(key, existing);
}

function resLocalsKey(req) {
  return req.res?.locals?.authThrottleKey;
}

export function submissionCooldown(req, res, next) {
  const challengeId = req.params.challengeId || req.body.challengeId || "global";
  const key = `${req.user?._id || req.ip}:${challengeId}`;
  const previous = submissionCooldowns.get(key) || 0;

  if (now() - previous < env.submissionCooldownMs) {
    return res.status(429).json({ message: "Submission cooldown active. Please wait a few seconds." });
  }

  submissionCooldowns.set(key, now());
  return next();
}

export function getSecurityStats() {
  return {
    activeAuthFailureKeys: authFailures.size,
    activeCooldownKeys: submissionCooldowns.size
  };
}
