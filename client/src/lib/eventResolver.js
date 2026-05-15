import { loadEventArchive } from "@/lib/eventArchive";
import { events } from "@/utils/constants";

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function resolveEventFromInput(eventOrId) {
  if (typeof eventOrId === "string") {
    const identifier = eventOrId.trim();
    return (
      events.find((event) => event.id === identifier || event.slug === identifier) ||
      null
    );
  }

  if (eventOrId && typeof eventOrId === "object") {
    return eventOrId;
  }

  return null;
}

export async function resolveEventData(eventOrId) {
  const event = resolveEventFromInput(eventOrId);
  if (!event) {
    return {
      mode: "missing",
      isPast: false,
      isLive: false,
      source: "none",
      success: false,
      error: "Event not found.",
      rows: [],
      archive: null,
      event: null,
    };
  }

  const status = normalizeStatus(event.status);
  const liveByMeta = event.scoreboardSource === "ctfd-live";
  const isPast = status === "past";
  const isLive = status === "live" || liveByMeta;

  if (isPast) {
    const archiveId = event?.archiveFile
      ? String(event.archiveFile).replace(/\.json$|\.csv$/i, "")
      : event?.id;
    const archive = await loadEventArchive(archiveId, event);

    return {
      mode: "past",
      isPast: true,
      isLive: false,
      source: archive.source,
      success: archive.success,
      error: archive.success ? "" : archive.error || "Archive unavailable",
      rows: archive.data?.teams || [],
      archive: archive.data,
      event,
    };
  }

  if (isLive) {
    return {
      mode: "live",
      isPast: false,
      isLive: true,
      source: event?.scoreboardSource || "ctfd-live",
      success: true,
      error: "",
      rows: [],
      archive: null,
      event,
    };
  }

  return {
    mode: "default",
    isPast: false,
    isLive: false,
    source: "none",
    success: true,
    error: "",
    rows: [],
    archive: null,
    event,
  };
}
