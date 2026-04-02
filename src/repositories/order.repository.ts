import { randomUUID } from "crypto";

import { orderStore } from "../models/order.model";
import { ICartItem } from "../types/cart.type";
import { IOrder } from "../types/order.type";

export const createOrder = (
  userId: string,
  items: ICartItem[],
  subtotal: number,
  discountAmount: number,
  totalAmount: number,
  discountCodeUsed?: string
): IOrder => {
  const order: IOrder = {
    id: randomUUID(),
    userId,
    items,
    subtotal,
    discountAmount,
    totalAmount,
    discountCodeUsed,
    createdAt: new Date(),
  };

  return orderStore.create(order);
};