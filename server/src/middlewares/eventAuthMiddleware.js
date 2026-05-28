import { CTFEvent } from "../models/CTFEvent.js";
import { EventMember } from "../models/EventMember.js";
import { getEventRolePermissions } from "../security/rbac.js";
import { isAdminRole } from "../security/rbac.js";

export async function attachCTFContext(req, res, next) {
  try {
    const slug = req.params.slug;
    if (!slug) return res.status(400).json({ message: "Missing CTF slug." });

    const ctf = await CTFEvent.findOne({ slug }).lean();
    if (!ctf) return res.status(404).json({ message: "CTF event not found." });

    req.ctf = ctf;

    if (req.user?._id) {
      const membership = await EventMember.findOne({ ctfId: ctf._id, userId: req.user._id }).lean();
      req.eventMembership = membership || null;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireCTFPermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    if (!req.ctf) return res.status(500).json({ message: "CTF context missing." });
    if (isAdminRole(req.user.role)) return next();

    const membership = req.eventMembership;
    if (!membership) return res.status(403).json({ message: "No membership for this event." });

    const granted = new Set([...(membership.permissions || []), ...getEventRolePermissions(membership.role)]);
    if (granted.has("*")) return next();

    const allowed = permissions.every((permission) => granted.has(permission));
    if (!allowed) return res.status(403).json({ message: "Insufficient event permissions." });

    return next();
  };
}
