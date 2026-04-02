import { STATUS_CODES } from "../constants/status";
import * as CartRepository from "../repositories/cart.repository";
import * as ItemRepository from "../repositories/item.repository";
import { ICartWithItems } from "../types/cart.type";
import { AppError } from "../utils/appError";
import { calculateCartTotal as calculateTotal } from "../utils/cart.util";

export const addItemToCart = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<ICartWithItems> => {
  // Validate item exists and has sufficient stock
  const item = ItemRepository.findItemById(itemId);
  if (!item) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "Item not found");
  }

  if (item.stock < quantity) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Insufficient stock available"
    );
  }

  // Get or create cart
  let cart = CartRepository.findCartByUserId(userId);
  if (!cart) {
    cart = CartRepository.createCart(userId);
  }

  // Check if adding this quantity exceeds available stock
  const existingItem = cart.items.find((i) => i.itemId === itemId);
  const totalQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (totalQuantity > item.stock) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      "Cannot add more items than available in stock"
    );
  }

  // Add item to cart
  const updatedCart = CartRepository.addItemToCart(
    cart.id,
    itemId,
    quantity,
    item.price
  );

  if (!updatedCart) {
    throw new AppError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to update cart");
  }

  return calculateCartTotal(updatedCart);
};

export const getCartByUserId = async (
  userId: string
): Promise<ICartWithItems | null> => {
  const cart = CartRepository.findCartByUserId(userId);
  if (!cart) {
    return null;
  }

  return calculateCartTotal(cart);
};

const calculateCartTotal = (cart: {
  id: string;
  userId: string;
  items: Array<{ itemId: string; quantity: number; price: number }>;
  createdAt: Date;
  updatedAt: Date;
}): ICartWithItems => {
  return {
    ...cart,
    totalAmount: calculateTotal(cart.items),
  };
};
