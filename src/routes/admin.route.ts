import { Router } from "express";

import * as AdminController from "../controllers/admin.controller";
import { asyncMiddleware } from "../utils/common.util";

const router = Router();

// Get statistics (items purchased, revenue, discount codes, total discounts)
router.get("/stats", asyncMiddleware(AdminController.getStatistics));

// Generate a discount code if nth order condition is satisfied
router.post("/discount-codes", asyncMiddleware(AdminController.generateDiscountCode));

export default router;
