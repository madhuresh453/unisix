import { getRolePermissions, isAdminRole } from "../security/rbac.js";

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function toPublicUser(user) {
  if (!user) return null;
  const role = user.role || "user";
  return {
    id: user._id,
    name: user.name,
    handle: user.handle,
    email: user.email,
    role,
    permissions: getRolePermissions(role),
    adminAccess: isAdminRole(role),
    country: user.country,
    score: user.score,
    badges: user.badges,
    team: user.team,
    xp: user.xp || 0,
    level: user.level || 1,
    rank: user.rank || "Script Kiddie",
    streaks: user.streaks || {},
    subscriptionPlan: user.subscriptionPlan || "free"
  };
}

export function pagination(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
