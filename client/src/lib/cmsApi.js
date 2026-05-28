export function getServerApiBase() {
  if (process.env.API_INTERNAL_URL) {
    const base = process.env.API_INTERNAL_URL.trim().replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    const base = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
  }
  return "http://localhost:5000/api";
}

export async function fetchCms(path, options = {}) {
  const base = getServerApiBase();
  const response = await fetch(`${base}${path}`, {
    ...options,
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
