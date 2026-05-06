import { body, param, query } from "express-validator";

export const registerRules = [
  body("name").trim().isLength({ min: 2, max: 80 }),
  body("handle").trim().isLength({ min: 3, max: 32 }).matches(/^[a-zA-Z0-9_.-]+$/),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 })
];

export const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 1 })
];

export const objectIdParam = (field) => param(field).isMongoId();

export const listQueryRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

export const submissionRules = [
  body("challengeId").isMongoId(),
  body("flag").trim().matches(/^UNI6\{.+\}$/)
];
