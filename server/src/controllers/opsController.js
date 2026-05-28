import mongoose from "mongoose";
import { getCacheStats } from "../config/cache.js";
import { getQueueStats } from "../config/queue.js";
import { getIO } from "../config/socket.js";
import { getSecurityStats } from "../security/abuseGuards.js";

export function healthStatus(req, res) {
  res.json({
    status: "ok",
    service: "uni6ctf-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}

export function diagnosticsStatus(req, res) {
  const io = getIO();
  const socketCount = io?.engine?.clientsCount || 0;

  res.json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    db: {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null
    },
    sockets: {
      clients: socketCount
    },
    cache: getCacheStats(),
    queue: getQueueStats(),
    security: getSecurityStats(),
    timestamp: new Date().toISOString()
  });
}
