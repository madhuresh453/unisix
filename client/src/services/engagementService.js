import { apiFetch } from "./api";

export function getMyNotifications(params = "") {
  return apiFetch(`/engagement/notifications${params ? `?${params}` : ""}`);
}

export function readNotification(id) {
  return apiFetch(`/engagement/notifications/${id}/read`, { method: "PATCH" });
}

export function readAllNotifications() {
  return apiFetch("/engagement/notifications/read-all", { method: "POST" });
}

export function getNotificationPreferences() {
  return apiFetch("/engagement/notifications/preferences");
}

export function updateNotificationPreferences(payload) {
  return apiFetch("/engagement/notifications/preferences", { method: "PUT", body: JSON.stringify(payload) });
}

export function getLiveActivity(params = "") {
  return apiFetch(`/engagement/activity${params ? `?${params}` : ""}`);
}

export function getGamificationState() {
  return apiFetch("/engagement/gamification/me");
}

export function grantXp(amount) {
  return apiFetch("/engagement/gamification/xp", { method: "POST", body: JSON.stringify({ amount }) });
}
