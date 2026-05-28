export function registerLearningSocket(io, socket) {
  socket.on("learning:join", ({ scope, id }) => {
    if (!scope || !id) return;
    socket.join(`learning:${scope}:${id}`);
  });

  socket.on("learning:leave", ({ scope, id }) => {
    if (!scope || !id) return;
    socket.leave(`learning:${scope}:${id}`);
  });

  socket.on("learning:progress", (payload) => {
    if (!payload?.scope || !payload?.id) return;
    io.to(`learning:${payload.scope}:${payload.id}`).emit("learning:progress:update", payload);
  });

  socket.on("learning:room:score", (payload) => {
    if (!payload?.roomId) return;
    io.to(`learning:room:${payload.roomId}`).emit("learning:room:score:update", payload);
  });

  socket.on("learning:workshop:presence", (payload) => {
    if (!payload?.workshopId) return;
    io.to(`learning:workshop:${payload.workshopId}`).emit("learning:workshop:presence:update", payload);
  });
}
