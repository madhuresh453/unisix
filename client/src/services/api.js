const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift() || "";
  return "";
}

export async function apiFetch(path, options = {}) {
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
