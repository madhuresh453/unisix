import { env } from "./env.js";

const baseOrigins = [
  "https://uni6ctf.online",
  "https://www.uni6ctf.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const allowedOrigins = new Set([...baseOrigins, ...env.clientUrls]);

function logOrigin(event, origin) {
  if (env.nodeEnv === "production") {
    console.log(`[CORS] ${event} origin=${origin || "none"}`);
  }
}

export function validateCorsOrigin(origin, callback) {
  logOrigin("incoming", origin);

  if (!origin || allowedOrigins.has(origin)) {
    return callback(null, true);
  }

  logOrigin("blocked", origin);
  return callback(new Error("Not allowed by CORS"));
}

export const corsOptions = {
  origin: validateCorsOrigin,
  credentials: true
};
