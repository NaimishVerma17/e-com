export interface ICartItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ICartWithItems extends ICart {
  totalAmount: number;
}
