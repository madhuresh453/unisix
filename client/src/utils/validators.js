export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isStrongPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

export function isFlag(value) {
  return /^UNI6\{.+\}$/.test(value.trim());
}
