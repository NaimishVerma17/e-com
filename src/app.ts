import express from "express";
import { corsMiddleware } from './middlewares/cors.middleware';
import ItemRoutes from "./routes/item.route";
import UserRoutes from "./routes/user.route";
import AdminRoutes from "./routes/admin.route";
import { errorHandlerMiddleware } from './middlewares/error.middleware';

const app = express();

// MIDDLEWARE
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));

// ROUTES
app.use("/items", ItemRoutes);
app.use("/users", UserRoutes);
app.use("/admin", AdminRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "E-commerce API is running" });
});
// GLOBAL ERROR HANDLER
//
app.use(errorHandlerMiddleware);

export { app };
