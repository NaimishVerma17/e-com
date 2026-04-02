import { IDiscountCode, IUserCouponUsage } from "../types/discount.type";

class DiscountCodeStore {
  private discountCodes: Map<string, IDiscountCode> = new Map();

  create(discountCode: IDiscountCode): IDiscountCode {
    this.discountCodes.set(discountCode.code, discountCode);
    return discountCode;
  }

  findByCode(code: string): IDiscountCode | undefined {
    return this.discountCodes.get(code);
  }

  findAll(): IDiscountCode[] {
    return Array.from(this.discountCodes.values());
  }

}

class UserCouponUsageStore {
  private usages: IUserCouponUsage[] = [];

  create(usage: IUserCouponUsage): IUserCouponUsage {
    this.usages.push(usage);
    return usage;
  }

  hasUserUsedCoupon(userId: string, discountCode: string): boolean {
    return this.usages.some(
      (usage) => usage.userId === userId && usage.discountCode === discountCode
    );
  }

  findAll(): IUserCouponUsage[] {
    return [...this.usages];
  }
}

export const discountCodeStore = new DiscountCodeStore();
export const userCouponUsageStore = new UserCouponUsageStore();
