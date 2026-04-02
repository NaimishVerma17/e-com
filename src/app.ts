import express from "express";
import { corsMiddleware } from './middlewares/cors.middleware';

const app = express();

// MIDDLEWARE
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));

// ROUTES

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "E-commerce API is running" });
});

export { app };
