export const rolePermissions = {
  super_admin: ["*"],
  admin: ["*"],
  moderator: ["leaderboard:manage", "notifications:manage", "submissions:read", "admin:access"],
  content_manager: [
    "content:manage",
    "writeups:manage",
    "sponsors:manage",
    "team:manage",
    "media:manage",
    "ctfs:manage",
    "challenges:manage",
    "admin:access"
  ],
  captain: [],
  user: []
};

export const adminRoles = new Set(["super_admin", "admin", "moderator", "content_manager"]);

export function isAdminRole(role) {
  return adminRoles.has(String(role || ""));
}

export function getRolePermissions(role) {
  return rolePermissions[role] || [];
}
