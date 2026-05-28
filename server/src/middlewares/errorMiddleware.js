import { validationResult } from "express-validator";
import { env } from "../config/env.js";

export function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) return next();

  if (env.authDebug && req.path.includes("/auth/login")) {
    console.log("[AUTH_DEBUG] login validation errors", {
      errors: result.array().map((error) => ({ field: error.path, message: error.msg }))
    });
  }

  return res.status(422).json({
    message: "Validation failed.",
    errors: result.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || "Internal server error.",
    ...(env.nodeEnv !== "production" ? { stack: error.stack } : {})
  });
}
