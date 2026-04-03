import { STATUS_CODES } from "../constants/status";
import * as CartRepository from "../repositories/cart.repository";
import * as DiscountRepository from "../repositories/discount.repository";
import * as ItemRepository from "../repositories/item.repository";
import * as OrderRepository from "../repositories/order.repository";
import { IOrder } from "../types/order.type";
import { AppError } from "../utils/appError";
import { calculateCartTotal } from "../utils/cart.util";
import { getOrdinalSuffix } from "../utils/common.util";

interface CheckoutResult {
  order: IOrder;
}

export const checkout = async (
  userId: string,
  discountCode?: string,
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

    // Check if user has already used this coupon
    if (DiscountRepository.hasUserUsedCoupon(userId, discountCode)) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "You have already used this discount code",
      );
    }

    // Get user's current order count (including this order)
    const userOrderCount = OrderRepository.getUserOrderCount(userId) + 1;

    // Check if user is on their nth order
    if (userOrderCount !== discount.nthOrder) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        `This discount code is only valid for your ${discount.nthOrder}${getOrdinalSuffix(discount.nthOrder)} order. This is your ${userOrderCount}${getOrdinalSuffix(userOrderCount)} order.`,
      );
    }

    discountAmount = (subtotal * discount.discountPercentage) / 100;

    // Mark coupon as used by this user
    DiscountRepository.markCouponAsUsedByUser(userId, discountCode);
  }

  const totalAmount = subtotal - discountAmount;

  // Verify stock availability and update stock
  for (const cartItem of cart.items) {
    const item = ItemRepository.findItemById(cartItem.itemId);
    if (!item) {
      throw new AppError(
        STATUS_CODES.NOT_FOUND,
        `Item ${cartItem.itemId} not found`,
      );
    }

    if (item.stock < cartItem.quantity) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        `Insufficient stock for item: ${item.name}`,
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
    discountCode,
  );

  // Clear cart
  CartRepository.clearCart(cart.id);

  return {
    order,
  };
};
