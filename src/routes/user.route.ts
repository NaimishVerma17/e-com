import { Router } from "express";

import CartRoutes from "./cart.route";

const router = Router();

// User-specific cart routes
router.use("/:userId/cart", CartRoutes);

export default router;
