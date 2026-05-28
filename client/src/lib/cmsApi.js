export function getServerApiBase() {
  if (process.env.API_INTERNAL_URL) return process.env.API_INTERNAL_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
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
