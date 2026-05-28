import { apiFetch } from "./api";

export function listLearningPaths(params = "") {
  return apiFetch(`/engagement/paths${params ? `?${params}` : ""}`);
}

export function getLearningPath(slug) {
  return apiFetch(`/engagement/paths/${slug}`);
}

export function listMentors(params = "") {
  return apiFetch(`/engagement/mentors${params ? `?${params}` : ""}`);
}
