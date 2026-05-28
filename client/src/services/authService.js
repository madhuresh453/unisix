import { apiFetch } from "./api";

export function login(payload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function me() {
  return apiFetch("/auth/me");
}

export function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function refresh() {
  return apiFetch("/auth/refresh", { method: "POST" });
}
