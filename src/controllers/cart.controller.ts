import { Request, Response } from "express";

import { STATUS_CODES } from "../constants/status";
import * as CartService from "../services/cart.service";

export const addToCart = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.userId as string;
  const { itemId, quantity } = req.body;
  const cart = await CartService.addItemToCart(userId, itemId, quantity);
  res.status(STATUS_CODES.OK).json({
    message: "Item added to cart successfully",
    cart,
  });
};
