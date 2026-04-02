import { Router } from "express";

import * as AdminController from "../controllers/admin.controller";
import { validate } from "../middlewares/validate.middleware";
import { asyncMiddleware } from "../utils/common.util";
import { generateDiscountCodeSchema } from "../validators/admin.validator";

const router = Router();

// Get statistics (items purchased, revenue, discount codes, total discounts)
router.get("/stats", asyncMiddleware(AdminController.getStatistics));

// Generate a discount code for nth order with specified percentage
router.post(
  "/discount-codes",
  validate(generateDiscountCodeSchema),
  asyncMiddleware(AdminController.generateDiscountCode)
);

export default router;
