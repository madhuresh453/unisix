import { AuditLog } from "../models/AuditLog.js";

export function auditAdminWrites(req, res, next) {
  const shouldTrack = req.path.startsWith("/api/admin") && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (!shouldTrack) return next();

  const end = res.end;
  res.end = function patchedEnd(...args) {
    AuditLog.create({
      actor: req.user?._id,
      action: `${req.method} ${req.path}`,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ip: req.ip,
      meta: { bodyKeys: Object.keys(req.body || {}) }
    }).catch(() => null);

    return end.apply(this, args);
  };

  return next();
}
