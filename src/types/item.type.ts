export interface IItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
