import { Request, Response } from "express";

import { STATUS_CODES } from "../constants/status";
import * as CheckoutService from "../services/checkout.service";

export const checkout = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { discountCode } = req.body;
  const result = await CheckoutService.checkout(userId, discountCode);

  res.status(STATUS_CODES.CREATED).json({
    message: "Order placed successfully",
    order: result.order,
  });
};
