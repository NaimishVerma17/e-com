import { IDiscountCode } from "../types/discount.type";

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

  markAsUsed(code: string, userId: string): boolean {
    const discountCode = this.discountCodes.get(code);
    if (!discountCode || discountCode.isUsed) {
      return false;
    }
    discountCode.isUsed = true;
    discountCode.usedBy = userId;
    discountCode.usedAt = new Date();
    return true;
  }
}

export const discountCodeStore = new DiscountCodeStore();
