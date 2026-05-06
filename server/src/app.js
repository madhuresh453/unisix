import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import apiRoutes from "./routes/index.js";
import { env } from "./config/env.js";
import { notFound, errorMiddleware } from "./middlewares/errorMiddleware.js";
import { requestLogger } from "./middlewares/logger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { inputSanitizer } from "./security/inputSanitizer.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(inputSanitizer);
app.use(requestLogger);
app.use("/api", apiLimiter, apiRoutes);
app.use(notFound);
app.use(errorMiddleware);

export default app;
