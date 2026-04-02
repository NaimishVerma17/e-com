import { discountCodeStore, userCouponUsageStore } from "../models/discount.model";
import { IDiscountCode, IUserCouponUsage } from "../types/discount.type";

export const createDiscountCode = (
  code: string,
  discountPercentage: number,
  nthOrder: number
): IDiscountCode => {
  const discountCode: IDiscountCode = {
    code,
    discountPercentage,
    nthOrder,
    createdAt: new Date(),
  };

  return discountCodeStore.create(discountCode);
};

export const findDiscountByCode = (code: string): IDiscountCode | undefined => {
  return discountCodeStore.findByCode(code);
};

export const findAllDiscountCodes = (): IDiscountCode[] => {
  return discountCodeStore.findAll();
};

export const markCouponAsUsedByUser = (
  userId: string,
  discountCode: string
): IUserCouponUsage => {
  const usage: IUserCouponUsage = {
    userId,
    discountCode,
    usedAt: new Date(),
  };
  return userCouponUsageStore.create(usage);
};

export const hasUserUsedCoupon = (
  userId: string,
  discountCode: string
): boolean => {
  return userCouponUsageStore.hasUserUsedCoupon(userId, discountCode);
};
