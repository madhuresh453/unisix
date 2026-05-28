import dotenv from "dotenv";

dotenv.config({ path: process.env.ENV_FILE || "../.env" });
dotenv.config();

const defaultClientOrigins = [
  "https://uni6ctf.online",
  "https://www.uni6ctf.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || defaultClientOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/uni6ctf",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-this-long-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  flagPepper: process.env.FLAG_PEPPER || "dev-only-change-this-flag-pepper",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120)
};

export function assertProductionSecrets() {
  if (env.nodeEnv !== "production") return;

  const unsafe = ["dev-only-change-this-long-secret", "dev-only-change-this-flag-pepper"];
  if (unsafe.includes(env.jwtSecret) || unsafe.includes(env.flagPepper)) {
    throw new Error("Production secrets must be configured before boot.");
  }
}
