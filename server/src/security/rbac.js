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
    "labs:manage",
    "rooms:manage",
    "courses:manage",
    "workshops:manage",
    "certificates:manage",
    "subscriptions:manage",
    "payments:manage",
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

export const eventRolePermissions = {
  ctf_admin: ["*", "admin:panel"],
  ctf_moderator: ["admin:panel", "submissions:moderate", "users:manage", "notifications:manage", "scoreboard:view"],
  challenge_author: ["admin:panel", "challenges:manage", "pages:manage"],
  scoreboard_manager: ["admin:panel", "scoreboard:manage", "statistics:view"],
  participant: ["scoreboard:view"]
};

export function getEventRolePermissions(role) {
  return eventRolePermissions[role] || [];
}
