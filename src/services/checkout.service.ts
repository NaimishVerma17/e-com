import { appConfig } from "../configs/app.config";
import { STATUS_CODES } from "../constants/status";
import * as CartRepository from "../repositories/cart.repository";
import * as DiscountRepository from "../repositories/discount.repository";
import * as ItemRepository from "../repositories/item.repository";
import * as OrderRepository from "../repositories/order.repository";
import { IDiscountCode } from "../types/discount.type";
import { AppError } from "../utils/appError";
import { calculateCartTotal } from "../utils/cart.util";
import {
  generateDiscountCode,
  generateDiscountPercentage,
} from "../utils/discountCodeGenerator";
import { IOrder } from '../types/order.type';

interface CheckoutResult {
  order: IOrder;
  generatedDiscountCode?: IDiscountCode;
}

export const checkout = async (
  userId: string,
  discountCode?: string
): Promise<CheckoutResult> => {
  // Get user's cart
  const cart = CartRepository.findCartByUserId(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError(STATUS_CODES.BAD_REQUEST, "Cart is empty");
  }

  // Calculate subtotal
  const subtotal = calculateCartTotal(cart.items);

  // Validate and apply discount code if provided
  let discountAmount = 0;

  if (discountCode) {
    const discount = DiscountRepository.findDiscountByCode(discountCode);

    if (!discount) {
      throw new AppError(STATUS_CODES.NOT_FOUND, "Invalid discount code");
    }

    if (discount.isUsed) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Discount code has already been used"
      );
    }

    discountAmount = (subtotal * discount.discountPercentage) / 100;

    // Mark discount as used
    DiscountRepository.markDiscountAsUsed(discountCode, userId);
  }

  const totalAmount = subtotal - discountAmount;

  // Verify stock availability and update stock
  for (const cartItem of cart.items) {
    const item = ItemRepository.findItemById(cartItem.itemId);
    if (!item) {
      throw new AppError(
        STATUS_CODES.NOT_FOUND,
        `Item ${cartItem.itemId} not found`
      );
    }

    if (item.stock < cartItem.quantity) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        `Insufficient stock for item: ${item.name}`
      );
    }

    // Update stock
    ItemRepository.updateItemStock(cartItem.itemId, cartItem.quantity);
  }

  // Create order
  const order = OrderRepository.createOrder(
    userId,
    cart.items,
    subtotal,
    discountAmount,
    totalAmount,
    discountCode
  );

  // Clear cart
  CartRepository.clearCart(cart.id);

  // Check if this is the nth order and generate discount code
  const totalOrders = OrderRepository.getTotalOrderCount();
  const nthOrder = appConfig.nthOrderForDiscount;

  let generatedDiscountCode: IDiscountCode | undefined;

  if (totalOrders % nthOrder === 0) {
    const newCode = generateDiscountCode();
    const newPercentage = generateDiscountPercentage(10, 25);

    generatedDiscountCode = DiscountRepository.createDiscountCode(
      newCode,
      newPercentage
    );
  }

  return {
    order,
    generatedDiscountCode,
  };
};
