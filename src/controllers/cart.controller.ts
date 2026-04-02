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

export const getCart = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const cart = await CartService.getCartByUserId(userId);

  if (!cart) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      message: "Cart not found"
    });
    return;
  }

  res.status(STATUS_CODES.OK).json({
    message: "Cart retrieved successfully",
    cart,
  });
};