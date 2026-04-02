import { randomUUID } from "crypto";

import { orderStore } from "../models/order.model";
import { ICartItem } from "../types/cart.type";
import { IOrder, IOrderStats } from "../types/order.type";

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

export const findAllOrders = (): IOrder[] => {
  return orderStore.findAll();
};

export const getTotalOrderCount = (): number => {
  return orderStore.getTotalCount();
};

export const getUserOrderCount = (userId: string): number => {
  const orders = orderStore.findAll();
  return orders.filter((order) => order.userId === userId).length;
};

export const getOrderStats = (): IOrderStats => {
  const orders = orderStore.findAll();

  const totalOrders = orders.length;
  const totalItemsPurchased = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalDiscountGiven = orders.reduce(
    (sum, order) => sum + order.discountAmount,
    0
  );

  return {
    totalOrders,
    totalItemsPurchased,
    totalRevenue,
    totalDiscountGiven,
  };
};
