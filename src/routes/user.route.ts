import { Router } from "express";

import CartRoutes from "./cart.route";
import CheckoutRoutes from "./checkout.route";

const router = Router();

// User-specific cart routes
router.use("/:userId/cart", CartRoutes);
// User-specific checkout route
router.use("/:userId/checkout", CheckoutRoutes);

export default router;
