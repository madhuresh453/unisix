console.log("SERVER FILE STARTING...");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { corsOptions } from "./src/config/cors.js";
import { connectDB } from "./src/config/db.js";
import { assertProductionSecrets, env } from "./src/config/env.js";
import { setIO } from "./src/config/socket.js";
import { startCleanupJob } from "./src/jobs/cleanupJob.js";
import { startEmailJob } from "./src/jobs/emailJob.js";
import { startLeaderboardJob } from "./src/jobs/leaderboardJob.js";
import { registerNotificationSocket } from "./src/sockets/notifications.js";
import { registerScoreboardSocket } from "./src/sockets/scoreboard.js";

console.log("Checking production secrets...");
assertProductionSecrets();

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions
});

setIO(io);

io.on("connection", (socket) => {
  registerScoreboardSocket(io, socket);
  registerNotificationSocket(io, socket);
});

async function bootstrap() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connected successfully");

    if (env.nodeEnv !== "test") {
      startLeaderboardJob();
      startCleanupJob();
      startEmailJob();
    }

    server.listen(env.port, () => {
      console.log(`UNI6CTF API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("BOOTSTRAP ERROR:");
    console.error(error);
    process.exit(1);
  }
}

console.log("Bootstrapping server...");
bootstrap();
