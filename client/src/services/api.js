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

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift() || "";
  return "";
}

export async function apiFetch(path, options = {}) {
  const API_URL = resolveApiBase();
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("uni6ctf_token") : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(!["GET", "HEAD", "OPTIONS"].includes(String(options.method || "GET").toUpperCase())
        ? { "x-csrf-token": readCookie("uni6ctf_csrf") }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
