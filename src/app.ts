import express from "express";
import { corsMiddleware } from './middlewares/cors.middleware';
import ItemRoutes from "./routes/item.route";

const app = express();

// MIDDLEWARE
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));

// ROUTES
app.use("/items", ItemRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "E-commerce API is running" });
});

export { app };
