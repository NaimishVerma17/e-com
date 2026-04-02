import { Router } from "express";

import * as CheckoutController from "../controllers/checkout.controller";
import { validate } from "../middlewares/validate.middleware";
import { asyncMiddleware } from "../utils/common.util";
import { checkoutSchema } from '../validators/checkout.validator';

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(checkoutSchema),
  asyncMiddleware(CheckoutController.checkout)
);

export default router;
