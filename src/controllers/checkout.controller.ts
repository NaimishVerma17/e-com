import { Request, Response } from "express";

import { STATUS_CODES } from "../constants/status";
import * as CheckoutService from "../services/checkout.service";
import { IDiscountCode } from '../types/discount.type';

export const checkout = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.userId as string;
  const { discountCode } = req.body;
  const result = await CheckoutService.checkout(userId, discountCode);

  const response: {
    message: string;
    order: typeof result.order;
    generatedDiscountCode?: IDiscountCode;
  } = {
    message: "Order placed successfully",
    order: result.order,
  };

  if (result.generatedDiscountCode) {
    response.generatedDiscountCode = result.generatedDiscountCode;
  }

  res.status(STATUS_CODES.CREATED).json(response);
};
