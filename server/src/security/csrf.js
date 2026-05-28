import crypto from "crypto";
import { env } from "../config/env.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split("=");
        return [key, decodeURIComponent(rest.join("="))];
      })
  );
}

export function csrfProtection(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || "");
  let csrfToken = cookies[env.csrfCookieName];

  if (!csrfToken) {
    csrfToken = crypto.randomBytes(24).toString("hex");
    const secure = env.nodeEnv === "production" ? "; Secure" : "";
    const nextCookie = `${env.csrfCookieName}=${csrfToken}; Path=/; SameSite=Lax${secure}`;
    const current = res.getHeader("Set-Cookie");
    if (!current) {
      res.setHeader("Set-Cookie", nextCookie);
    } else if (Array.isArray(current)) {
      res.setHeader("Set-Cookie", [...current, nextCookie]);
    } else {
      res.setHeader("Set-Cookie", [current, nextCookie]);
    }
  }

  if (safeMethods.has(req.method)) return next();

  const headerValue = req.headers[env.csrfHeaderName];
  const isAuthWrite = Boolean(req.headers.authorization) || req.path.startsWith("/api/admin");

  if (!isAuthWrite) return next();
  if (!headerValue || headerValue !== csrfToken) {
    return res.status(403).json({ message: "Invalid CSRF token." });
  }

  return next();
}
