import * as DiscountRepository from "../repositories/discount.repository";
import * as OrderRepository from "../repositories/order.repository";
import { IDiscountCode } from "../types/discount.type";
import { IOrderStats } from "../types/order.type";
import {
  generateDiscountCode,
} from "../utils/discountCodeGenerator";
import { getOrdinalSuffix } from '../utils/common.util';

interface AdminStats extends IOrderStats {
  discountCodes: IDiscountCode[];
}

export const getStatistics = async (): Promise<AdminStats> => {
  const orderStats = OrderRepository.getOrderStats();
  const discountCodes = DiscountRepository.findAllDiscountCodes();

  return {
    ...orderStats,
    discountCodes,
  };
};

export const generateDiscountCodeManually = async (
  nthOrder: number,
  discountPercentage: number
): Promise<{
  discountCode: IDiscountCode;
  message: string;
}> => {
  const code = generateDiscountCode();

  const discountCode = DiscountRepository.createDiscountCode(
    code,
    discountPercentage,
    nthOrder
  );

  return {
    discountCode,
    message: `Discount code generated successfully for every ${nthOrder}${getOrdinalSuffix(nthOrder)} order with ${discountPercentage}% discount`,
  };
};
