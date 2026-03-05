// src/server.js — THE ENTRY POINT

// This line MUST be first — loads .env before anything else reads process.env
import { PORT, FRONTEND_URL } from "./config/env.js";
import HTTP_STATUS from './utils/http.js';

import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import './config/redis.js'
// We import redis here to trigger its .connect() call at startup
// Even though we don't use redisClient directly in this file

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));
// limit: "10kb" prevents huge payload attacks

// health check
app.get("/health", (req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok", timestamp: new Date().toISOString() });
  // Used by Docker, load balancers, uptime monitors to check if server is alive
});

// routes
app.use("/api/auth", authRoutes);
// All routes in auth.routes.js are now accessible under /api/auth/...
// e.g., POST /api/auth/register, POST /api/auth/login

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: "error",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// global error handeller
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`erver running on http://localhost:${PORT}`);
});
