import { apiFetch } from "@/services/api";

export function fetchLabWorkspace(labId) {
  return apiFetch(`/labs/${labId}/workspace`);
}

export function fetchLabAssets(labId) {
  return apiFetch(`/labs/${labId}/assets`);
}

export function unlockStageHint(labId, stageId, hintId) {
  return apiFetch(`/labs/${labId}/stages/${stageId}/hints/${hintId}/unlock`, {
    method: "POST"
  });
}

export function submitStageFlag(labId, stageId, flag) {
  return apiFetch(`/labs/${labId}/stages/${stageId}/flags`, {
    method: "POST",
    body: JSON.stringify({ flag })
  });
}

export function saveLabNote(labId, note) {
  return apiFetch(`/labs/${labId}/notes`, {
    method: "POST",
    body: JSON.stringify(note)
  });
}

export function loadLabNotes(labId) {
  return apiFetch(`/labs/${labId}/notes`);
}
