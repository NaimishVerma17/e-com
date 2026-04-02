import { ICartItem } from "./cart.type";

export interface IOrder {
  id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  discountCodeUsed?: string;
  readonly createdAt: Date;
}

export interface IOrderStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
}
