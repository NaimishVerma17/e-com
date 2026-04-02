import { appConfig } from "../configs/app.config";
import { STATUS_CODES } from "../constants/status";
import * as DiscountRepository from "../repositories/discount.repository";
import * as OrderRepository from "../repositories/order.repository";
import { IDiscountCode } from "../types/discount.type";
import { IOrderStats } from "../types/order.type";
import { AppError } from "../utils/appError";
import {
  generateDiscountCode,
  generateDiscountPercentage,
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

export const generateDiscountCodeManually = async (): Promise<{
  discountCode: IDiscountCode;
  message: string;
}> => {
  const totalOrders = OrderRepository.getTotalOrderCount();
  const nthOrder = appConfig.nthOrderForDiscount;

  // Check if the nth order condition is satisfied
  if (totalOrders % nthOrder !== 0 || totalOrders === 0) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      `Discount code can only be generated at every ${nthOrder}${getOrdinalSuffix(nthOrder)} order. Current order count: ${totalOrders}`
    );
  }

  // Generate a new discount code
  const code = generateDiscountCode();
  const percentage = generateDiscountPercentage(10, 25);

  const discountCode = DiscountRepository.createDiscountCode(code, percentage);

  return {
    discountCode,
    message: `Discount code generated successfully for the ${totalOrders}${getOrdinalSuffix(totalOrders)} order milestone`,
  };
};
