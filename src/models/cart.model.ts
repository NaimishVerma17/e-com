import { ICart, ICartItem } from "../types/cart.type";

class CartStore {
  private carts: Map<string, ICart> = new Map();

  findByUserId(userId: string): ICart | undefined {
    return Array.from(this.carts.values()).find(
      (cart) => cart.userId === userId
    );
  }

  findById(cartId: string): ICart | undefined {
    return this.carts.get(cartId);
  }

  create(cart: ICart): ICart {
    this.carts.set(cart.id, cart);
    return cart;
  }

  update(cartId: string, items: ICartItem[]): ICart | undefined {
    const cart = this.carts.get(cartId);
    if (!cart) {
      return undefined;
    }
    cart.items = items;
    return cart;
  }

  delete(cartId: string): boolean {
    return this.carts.delete(cartId);
  }
}

export const cartStore = new CartStore();
