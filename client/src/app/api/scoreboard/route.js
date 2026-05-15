import { NextResponse } from "next/server";

const CTFD_BASE_URL = "https://hkuctf4.ponivanetworks.com";
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 1;
const SCOREBOARD_PATHS = [
  "/api/v1/scoreboard",
  "/api/v1/scoreboard/",
  "/api/v1/scoreboard/top/10",
  "/api/v1/scoreboard/top/10/",
  "/scoreboard",
  "/api/v1/teams",
];

const DEFAULT_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  DNT: "1",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: `${CTFD_BASE_URL}/scoreboard`,
  Origin: CTFD_BASE_URL,
};

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getArrayLikeRows(payload) {
  if (Array.isArray(payload)) return payload;

  const data = payload?.data;
  if (Array.isArray(data)) return data;

  if (Array.isArray(payload?.standings)) return payload.standings;
  if (Array.isArray(data?.standings)) return data.standings;

  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(data?.rows)) return data.rows;

  if (Array.isArray(payload?.top)) return payload.top;
  if (Array.isArray(data?.top)) return data.top;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const values = Object.values(data);
    if (values.length > 0 && values.every((value) => value && typeof value === "object")) {
      return values;
    }
  }

  return [];
}

function normalizeScoreboardRows(payload) {
  const items = getArrayLikeRows(payload);

  return items.map((entry, index) => {
    const rank = asNumber(entry?.pos ?? entry?.place ?? entry?.rank ?? index + 1, index + 1);
    const teamName = String(entry?.name ?? entry?.team ?? entry?.team_name ?? entry?.user ?? "Unknown Team");
    const scoreValue = asNumber(entry?.score ?? entry?.points ?? entry?.value ?? 0, 0);
    const country = entry?.country ? String(entry.country) : "Global";

    return {
      rank,
      user: teamName,
      team: teamName,
      country,
      score: scoreValue,
      points: scoreValue,
    };
  });
}

function normalizeTeamsRows(payload) {
  const data = payload?.data;
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.teams)
      ? data.teams
      : getArrayLikeRows(payload);

  const normalized = items.map((entry, index) => {
    const teamName = String(entry?.name ?? "Unknown Team");
    const scoreValue = asNumber(entry?.score ?? 0, 0);
    const country = entry?.country ? String(entry.country) : "Global";

    return {
      rank: asNumber(entry?.pos ?? entry?.place ?? index + 1, index + 1),
      user: teamName,
      team: teamName,
      country,
      score: scoreValue,
      points: scoreValue,
    };
  });

  return normalized
    .sort((a, b) => b.score - a.score || a.rank - b.rank)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'");
}

function stripHtml(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function parseScoreboardHtml(html) {
  const safeHtml = String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  const tbodyMatch = safeHtml.match(/<tbody[\s\S]*?>([\s\S]*?)<\/tbody>/i);
  const region = tbodyMatch ? tbodyMatch[1] : safeHtml;
  const rowMatches = region.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const rows = [];

  for (const rowHtml of rowMatches) {
    const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) => stripHtml(match[1]));
    if (!cells.length) continue;

    const maybeRank = asNumber(cells[0], NaN);
    const hasRank = Number.isFinite(maybeRank);
    const rank = hasRank ? maybeRank : rows.length + 1;
    const teamName = cells[hasRank ? 1 : 0] || "Unknown Team";

    let scoreValue = 0;
    for (let index = cells.length - 1; index >= 0; index -= 1) {
      const numeric = asNumber(cells[index], NaN);
      if (Number.isFinite(numeric)) {
        scoreValue = numeric;
        break;
      }
    }

    rows.push({
      rank,
      user: teamName,
      team: teamName,
      country: "Global",
      score: scoreValue,
      points: scoreValue,
    });
  }

  return rows
    .filter((row) => row.team && row.team.toLowerCase() !== "team")
    .sort((a, b) => a.rank - b.rank || b.score - a.score)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

async function fetchWithTimeout(url, acceptHeader) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        Accept: acceptHeader || DEFAULT_HEADERS.Accept,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchEndpoint(pathname, acceptHeader = "application/json") {
  const url = `${CTFD_BASE_URL}${pathname}`;
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, acceptHeader);
      return response;
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === MAX_RETRIES;
      if (isLastAttempt) throw lastError;
    }
  }

  throw lastError || new Error("Fetch failed");
}

function successResponse(rows, source) {
  return NextResponse.json(
    {
      success: true,
      rows,
      source,
      fetchedAt: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function GET() {
  const failures = [];

  try {
    for (const pathname of SCOREBOARD_PATHS) {
      try {
        console.info("[scoreboard-api] trying endpoint", { pathname });

        if (pathname === "/scoreboard") {
          const htmlResponse = await fetchEndpoint(pathname, "text/html,application/xhtml+xml");
          console.info("[scoreboard-api] endpoint response", { pathname, status: htmlResponse.status });

          if (!htmlResponse.ok) {
            failures.push(`${pathname}:${htmlResponse.status}`);
            continue;
          }
          const html = await htmlResponse.text();
          const rows = parseScoreboardHtml(html);
          if (rows.length > 0) {
            console.info("[scoreboard-api] source selected", { pathname, rows: rows.length });
            return successResponse(rows, pathname);
          }
          failures.push(`${pathname}:empty`);
          continue;
        }

        const jsonResponse = await fetchEndpoint(pathname, "application/json");
        console.info("[scoreboard-api] endpoint response", { pathname, status: jsonResponse.status });

        if (!jsonResponse.ok) {
          failures.push(`${pathname}:${jsonResponse.status}`);
          continue;
        }

        const payload = await jsonResponse.json().catch(() => ({}));
        const apiSuccess = payload?.success;
        if (apiSuccess === false) {
          failures.push(`${pathname}:api-false`);
          continue;
        }

        const rows =
          pathname === "/api/v1/teams" ? normalizeTeamsRows(payload) : normalizeScoreboardRows(payload);

        if (rows.length > 0) {
          console.info("[scoreboard-api] source selected", { pathname, rows: rows.length });
          return successResponse(rows, pathname);
        }

        failures.push(`${pathname}:empty`);
      } catch (endpointError) {
        failures.push(`${pathname}:error`);
      }
    }

    console.warn("[scoreboard-api] all upstream paths failed", {
      failureCount: failures.length,
      failures,
    });

    return NextResponse.json(
      {
        success: false,
        rows: [],
        error: "Live scoreboard is currently unavailable.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("[scoreboard-api] Request failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        rows: [],
        error: "Failed to fetch live scoreboard.",
      },
      { status: 500 }
    );
  }
}
