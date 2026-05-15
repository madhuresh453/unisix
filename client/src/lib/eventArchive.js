import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sanitizeRole(role, index = 0) {
  const rawRole = String(role || "").trim();
  const emailLike = /@.+\./.test(rawRole);
  if (!rawRole || emailLike) {
    return index === 0 ? "Captain" : "Core Member";
  }
  return rawRole;
}

function normalizeMember(member, index = 0) {
  if (!member || typeof member !== "object") {
    return {
      name: `Member ${index + 1}`,
      username: "",
      role: index === 0 ? "Captain" : "Core Member",
    };
  }

  return {
    name: String(member.name || member.fullName || `Member ${index + 1}`),
    username: String(member.username || member.handle || ""),
    role: sanitizeRole(member.role, index),
  };
}

function normalizeTeam(team, index = 0) {
  const members = Array.isArray(team.members) ? team.members.map(normalizeMember) : [];
  const score = asNumber(team.score ?? team.points ?? 0, 0);
  const points = asNumber(team.points ?? team.score ?? 0, score);

  return {
    rank: asNumber(team.rank ?? team.pos ?? index + 1, index + 1),
    team: String(team.team || team.name || `Team ${index + 1}`),
    user: String(team.team || team.name || `Team ${index + 1}`),
    country: String(team.country || "Global"),
    score,
    points,
    members,
    memberCount: members.length,
    stats: typeof team.stats === "object" && team.stats ? team.stats : {},
  };
}

function normalizeArchiveFromJson(payload, eventMeta) {
  const teams = Array.isArray(payload?.teams) ? payload.teams.map(normalizeTeam) : [];

  return {
    event: String(payload?.event || eventMeta?.name || "Past CTF Event"),
    description: String(payload?.description || eventMeta?.longDescription || eventMeta?.description || ""),
    date: String(payload?.date || ""),
    duration: String(payload?.duration || eventMeta?.duration || ""),
    participants: asNumber(payload?.participants ?? eventMeta?.participants ?? teams.length, teams.length),
    winners: Array.isArray(payload?.winners) ? payload.winners : Array.isArray(eventMeta?.winners) ? eventMeta.winners : [],
    teams: teams
      .sort((a, b) => a.rank - b.rank || b.score - a.score)
      .map((team, index) => ({ ...team, rank: index + 1 })),
  };
}

function parseMembersField(rawMembers) {
  if (!rawMembers) return [];

  try {
    const jsonMembers = JSON.parse(String(rawMembers));
    if (Array.isArray(jsonMembers)) return jsonMembers.map(normalizeMember);
  } catch {
    // Fallback to delimiter parsing.
  }

  return String(rawMembers)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [name = "", username = "", role = ""] = entry.split(";").map((part) => part.trim());
      return normalizeMember({ name, username, role }, index);
    });
}

function normalizeArchiveFromCsv(csvText, eventMeta) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => String(header || "").trim().toLowerCase(),
  });

  if (parsed.errors?.length) {
    throw new Error("CSV parsing error");
  }

  const teams = (parsed.data || []).map((row, index) =>
    normalizeTeam(
      {
        rank: row.rank || row.pos,
        team: row.team || row.name,
        country: row.country,
        score: row.score,
        points: row.points,
        members: parseMembersField(row.members || row.members_json),
      },
      index
    )
  );

  return {
    event: eventMeta?.name || "Past CTF Event",
    description: eventMeta?.longDescription || eventMeta?.description || "",
    date: "",
    duration: eventMeta?.duration || "",
    participants: asNumber(eventMeta?.participants ?? teams.length, teams.length),
    winners: Array.isArray(eventMeta?.winners) ? eventMeta.winners : [],
    teams: teams
      .sort((a, b) => a.rank - b.rank || b.score - a.score)
      .map((team, index) => ({ ...team, rank: index + 1 })),
  };
}

async function readFileIfExists(absolutePath) {
  try {
    return await fs.readFile(absolutePath, "utf8");
  } catch {
    return null;
  }
}

export async function loadEventArchive(eventId, eventMeta) {
  const baseDir = path.join(process.cwd(), "public", "data", "events");
  const jsonPath = path.join(baseDir, `${eventId}.json`);
  const csvPath = path.join(baseDir, `${eventId}.csv`);

  const jsonText = await readFileIfExists(jsonPath);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      return {
        success: true,
        source: "json",
        data: normalizeArchiveFromJson(parsed, eventMeta),
      };
    } catch {
      return {
        success: false,
        source: "json",
        error: "Invalid JSON event file format.",
        data: null,
      };
    }
  }

  const csvText = await readFileIfExists(csvPath);
  if (csvText) {
    try {
      return {
        success: true,
        source: "csv",
        data: normalizeArchiveFromCsv(csvText, eventMeta),
      };
    } catch {
      return {
        success: false,
        source: "csv",
        error: "Invalid CSV event file format.",
        data: null,
      };
    }
  }

  return {
    success: false,
    source: "none",
    error: "No event archive file found.",
    data: null,
  };
}
