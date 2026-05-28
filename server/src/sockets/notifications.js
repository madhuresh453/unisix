export function registerNotificationSocket(io, socket) {
  socket.on("activity:join", () => {
    socket.join("platform:activity");
  });

  socket.on("activity:leave", () => {
    socket.leave("platform:activity");
  });

  socket.on("notifications:join", ({ userId } = {}) => {
    if (userId) socket.join(`user:${userId}`);
  });

  socket.on("notifications:leave", ({ userId } = {}) => {
    if (userId) socket.leave(`user:${userId}`);
  });
}
