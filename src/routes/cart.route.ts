import { Router } from "express";

import * as CartController from "../controllers/cart.controller";
import { validate } from "../middlewares/validate.middleware";
import { asyncMiddleware } from "../utils/common.util";
import { addToCartSchema } from "../validators/cart.validator";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(addToCartSchema),
  asyncMiddleware(CartController.addToCart)
);

router.get(
  "/",
  asyncMiddleware(CartController.getCart)
);

export default router;
