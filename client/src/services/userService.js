import { apiFetch } from "./api";

export function getProfile() {
  return apiFetch("/users/me");
}

export function updateProfile(payload) {
  return apiFetch("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
