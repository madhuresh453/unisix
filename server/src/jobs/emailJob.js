export function startEmailJob() {
  const interval = setInterval(() => {
    console.log("Email job heartbeat", new Date().toISOString());
  }, 5 * 60 * 1000);

  return () => clearInterval(interval);
}
