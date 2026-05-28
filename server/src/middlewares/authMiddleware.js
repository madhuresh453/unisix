import { User } from "../models/User.js";
import { verifyToken } from "../utils/token.js";
import { getRolePermissions } from "../security/rbac.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const cookieRaw = req.headers.cookie || "";
    const cookieToken = cookieRaw
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("uni6ctf_token="))
      ?.split("=")
      .slice(1)
      .join("=");
    const token = header.startsWith("Bearer ") ? header.slice(7) : cookieToken || null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }

    return next();
  };
}

export function requireGlobalRole(...roles) {
  return requireRole(...roles);
}

export function requirePermission(...permissions) {
  return (req, res, next) => {
    const role = req.user?.role || "user";
    const granted = getRolePermissions(role);
    if (granted.includes("*") || permissions.every((permission) => granted.includes(permission))) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden." });
  };
}
