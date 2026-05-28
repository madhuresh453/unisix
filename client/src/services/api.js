function resolveApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw) {
    const trimmed = raw.trim().replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  if (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
    return "http://localhost:5000/api";
  }

  return "/api";
}

let csrfTokenCache = "";

function isSafeMethod(method) {
  return ["GET", "HEAD", "OPTIONS"].includes(String(method || "GET").toUpperCase());
}

async function getCsrfToken(apiBase) {
  if (csrfTokenCache) return csrfTokenCache;
  const response = await fetch(`${apiBase}/auth/csrf`, { method: "GET", credentials: "include" });
  const data = await response.json().catch(() => ({}));
  csrfTokenCache = data?.csrfToken || response.headers.get("x-csrf-token") || "";
  return csrfTokenCache;
}

export async function apiFetch(path, options = {}, retry = false) {
  const API_URL = resolveApiBase();
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("uni6ctf_token") : null;
  const method = String(options.method || "GET").toUpperCase();
  const csrfToken = isSafeMethod(method) ? "" : await getCsrfToken(API_URL);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const headerCsrf = response.headers.get("x-csrf-token");
  if (headerCsrf) csrfTokenCache = headerCsrf;

  const data = await response.json().catch(() => ({}));

  if (!response.ok && response.status === 403 && data?.message === "Invalid CSRF token." && !retry) {
    csrfTokenCache = "";
    await getCsrfToken(API_URL);
    return apiFetch(path, options, true);
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
