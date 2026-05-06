export function startCleanupJob() {
  const interval = setInterval(() => {
    console.log("Cleanup job heartbeat", new Date().toISOString());
  }, 60 * 60 * 1000);

  return () => clearInterval(interval);
}
