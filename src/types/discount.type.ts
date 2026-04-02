export interface IDiscountCode {
  code: string;
  discountPercentage: number;
  nthOrder: number;
  readonly createdAt: Date;
}

export interface IUserCouponUsage {
  userId: string;
  discountCode: string;
  usedAt: Date;
}
