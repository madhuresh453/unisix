let ioInstance = null;

export function setIO(io) {
  ioInstance = io;
}

export function getIO() {
  return ioInstance;
}

export function emitScoreboard(eventId, rows) {
  if (!ioInstance) return;
  ioInstance.to(`scoreboard:${eventId}`).emit("scoreboard:update", { eventId, rows });
}

export function emitNotification(userId, notification) {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit("notification:new", notification);
}

export function emitActivity(activity) {
  if (!ioInstance) return;
  ioInstance.to("platform:activity").emit("activity:new", activity);
}
