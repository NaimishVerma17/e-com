import express from "express";

const app = express();

// MIDDLEWARE
app.use(express.json({ limit: "10mb" }));

// ROUTES

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "E-commerce API is running" });
});

export { app };
