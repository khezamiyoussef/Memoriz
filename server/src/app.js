import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Comma-separated, e.g. "https://memoriz.club,http://localhost:8080"
const allowedOrigins = (process.env.CORS_ORIGINS || "https://memoriz.club")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Number of reverse proxies in front of the server, so rate limits see client IPs
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));

app.use(helmet());
app.use(cors({ origin: allowedOrigins, methods: ["GET"], allowedHeaders: ["Authorization"] }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
