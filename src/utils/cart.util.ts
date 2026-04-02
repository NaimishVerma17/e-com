import { ICartItem } from "../types/cart.type";

/**
 * Calculates the total amount for a list of cart items
 */
export const calculateCartTotal = (items: ICartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
