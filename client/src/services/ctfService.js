import { apiFetch } from "./api";

export function listCTFs(status) {
  const query = status ? `?status=${status}` : "";
  return apiFetch(`/ctfs${query}`);
}

export function getCTF(eventId) {
  return apiFetch(`/ctfs/${eventId}`);
}

export function registerForCTF(eventId) {
  return apiFetch(`/ctfs/${eventId}/register`, { method: "POST" });
}
