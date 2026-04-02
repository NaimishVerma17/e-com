import { discountCodeStore } from "../models/discount.model";
import { IDiscountCode } from "../types/discount.type";

export const createDiscountCode = (
  code: string,
  discountPercentage: number
): IDiscountCode => {
  const discountCode: IDiscountCode = {
    code,
    discountPercentage,
    isUsed: false,
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

export const markDiscountAsUsed = (code: string, userId: string): boolean => {
  return discountCodeStore.markAsUsed(code, userId);
};
