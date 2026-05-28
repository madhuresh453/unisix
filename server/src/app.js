import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/index.js";
import { corsOptions } from "./config/cors.js";
import { notFound, errorMiddleware } from "./middlewares/errorMiddleware.js";
import { requestLogger } from "./middlewares/logger.js";
import { auditAdminWrites } from "./middlewares/auditMiddleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { inputSanitizer } from "./security/inputSanitizer.js";
import { csrfProtection } from "./security/csrf.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https:"],
        "connect-src": ["'self'", "https:", "wss:"]
      }
    }
  })
);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
app.use(csrfProtection);
app.use(inputSanitizer);
app.use(requestLogger);
app.use(auditAdminWrites);
app.use("/api", apiLimiter, apiRoutes);
app.use(notFound);
app.use(errorMiddleware);

export default app;
