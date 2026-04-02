import { IOrder } from "../types/order.type";

class OrderStore {
  private orders: Map<string, IOrder> = new Map();

  create(order: IOrder): IOrder {
    this.orders.set(order.id, order);
    return order;
  }

  findAll(): IOrder[] {
    return Array.from(this.orders.values());
  }

  findById(orderId: string): IOrder | undefined {
    return this.orders.get(orderId);
  }

  getTotalCount(): number {
    return this.orders.size;
  }
}

export const orderStore = new OrderStore();
