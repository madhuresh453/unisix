import { getServerApiBase } from "./cmsApi";

function learningBase() {
  return `${getServerApiBase()}/learning`;
}

export async function fetchLearningList(type, searchParams = "") {
  const response = await fetch(`${learningBase()}/${type}${searchParams ? `?${searchParams}` : ""}`, { cache: "no-store" });
  if (!response.ok) return { items: [] };
  return response.json();
}

export async function fetchLearningDetail(type, slug) {
  const response = await fetch(`${learningBase()}/${type}/slug/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}
