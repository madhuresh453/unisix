import { apiFetch } from "./api";

export function listChallenges(params = "") {
  return apiFetch(`/challenges${params}`);
}

export function getChallenge(challengeId) {
  return apiFetch(`/challenges/${challengeId}`);
}

export function submitFlag(challengeId, flag) {
  return apiFetch(`/submissions`, {
    method: "POST",
    body: JSON.stringify({ challengeId, flag })
  });
}

export function unlockHint(challengeId, hintId) {
  return apiFetch(`/challenges/${challengeId}/hints/${hintId}/unlock`, {
    method: "POST"
  });
}
