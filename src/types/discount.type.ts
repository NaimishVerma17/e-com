export interface IDiscountCode {
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: Date;
  readonly createdAt: Date;
}
