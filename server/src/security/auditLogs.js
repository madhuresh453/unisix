export function audit(event, details = {}) {
  console.log("[audit]", {
    event,
    at: new Date().toISOString(),
    ...details
  });
}
