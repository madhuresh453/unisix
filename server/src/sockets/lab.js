export function registerLabSocket(io, socket) {
  socket.on("lab:join", ({ labId }) => {
    if (!labId) return;
    socket.join(`lab:${labId}`);
  });

  socket.on("lab:leave", ({ labId }) => {
    if (!labId) return;
    socket.leave(`lab:${labId}`);
  });
}
