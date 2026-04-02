import { randomUUID } from "crypto";

import { cartStore } from "../models/cart.model";
import { ICart, ICartItem } from "../types/cart.type";

export const findCartByUserId = (userId: string): ICart | undefined => {
  return cartStore.findByUserId(userId);
};

export const createCart = (userId: string): ICart => {
  const cart: ICart = {
    id: randomUUID(),
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return cartStore.create(cart);
};

export const addItemToCart = (
  cartId: string,
  itemId: string,
  quantity: number,
  price: number
): ICart | undefined => {
  const cart = cartStore.findById(cartId);
  if (!cart) {
    return undefined;
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.itemId === itemId
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    const newItem: ICartItem = {
      itemId,
      quantity,
      price,
    };
    cart.items.push(newItem);
  }

  return cartStore.update(cartId, cart.items);
};

export const clearCart = (cartId: string): boolean => {
  return cartStore.delete(cartId);
};
