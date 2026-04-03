import * as CartRepository from "../src/repositories/cart.repository";
import * as DiscountRepository from "../src/repositories/discount.repository";
import * as ItemRepository from "../src/repositories/item.repository";
import * as OrderRepository from "../src/repositories/order.repository";
import * as CheckoutService from "../src/services/checkout.service";
import { ICart } from "../src/types/cart.type";
import { IDiscountCode } from "../src/types/discount.type";
import { IItem } from "../src/types/item.type";
jest.mock("../src/repositories/cart.repository");
jest.mock("../src/repositories/discount.repository");
jest.mock("../src/repositories/item.repository");
jest.mock("../src/repositories/order.repository");

describe("CheckoutService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkout", () => {
    it("completes checkout without a discount and clears the cart", async () => {
      const userId = "user-1";
      const mockCart: ICart = {
        id: "cart-1",
        userId,
        items: [
          { itemId: "item-1", quantity: 2, price: 100 },
          { itemId: "item-2", quantity: 1, price: 50 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockItem1: IItem = {
        id: "item-1",
        name: "Item 1",
        description: "Description",
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockItem2: IItem = {
        id: "item-2",
        name: "Item 2",
        description: "Description",
        price: 50,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(mockCart);
      (ItemRepository.findItemById as jest.Mock)
        .mockReturnValueOnce(mockItem1)
        .mockReturnValueOnce(mockItem2);
      (ItemRepository.updateItemStock as jest.Mock).mockReturnValue(true);
      (OrderRepository.createOrder as jest.Mock).mockReturnValue({
        id: "order-1",
        userId,
        items: mockCart.items,
        subtotal: 250,
        discountAmount: 0,
        totalAmount: 250,
        createdAt: new Date(),
      });
      (CartRepository.clearCart as jest.Mock).mockReturnValue(true);

      const result = await CheckoutService.checkout(userId);

      expect(result.order.subtotal).toBe(250);
      expect(result.order.discountAmount).toBe(0);
      expect(result.order.totalAmount).toBe(250);
      expect(CartRepository.clearCart).toHaveBeenCalledWith("cart-1");
    });

    it("applies a valid discount on the eligible order and records coupon use", async () => {
      const userId = "user-1";
      const discountCode = "DISCOUNT-ABC123";
      const mockCart: ICart = {
        id: "cart-1",
        userId,
        items: [{ itemId: "item-1", quantity: 2, price: 100 }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDiscount: IDiscountCode = {
        code: discountCode,
        discountPercentage: 20,
        nthOrder: 2,
        createdAt: new Date(),
      };

      const mockItem: IItem = {
        id: "item-1",
        name: "Item 1",
        description: "Description",
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(mockCart);
      (DiscountRepository.findDiscountByCode as jest.Mock).mockReturnValue(
        mockDiscount
      );
      (DiscountRepository.hasUserUsedCoupon as jest.Mock).mockReturnValue(false);
      (OrderRepository.getUserOrderCount as jest.Mock).mockReturnValue(1);
      (ItemRepository.findItemById as jest.Mock).mockReturnValue(mockItem);
      (ItemRepository.updateItemStock as jest.Mock).mockReturnValue(true);
      (DiscountRepository.markCouponAsUsedByUser as jest.Mock).mockReturnValue({
        userId,
        discountCode,
        usedAt: new Date(),
      });
      (OrderRepository.createOrder as jest.Mock).mockImplementation(
        (userId, items, subtotal, discountAmount, totalAmount, code) => ({
          id: "order-1",
          userId,
          items,
          subtotal,
          discountAmount,
          totalAmount,
          discountCodeUsed: code,
          createdAt: new Date(),
        })
      );
      (CartRepository.clearCart as jest.Mock).mockReturnValue(true);

      const result = await CheckoutService.checkout(userId, discountCode);

      expect(result.order.subtotal).toBe(200);
      expect(result.order.discountAmount).toBe(40);
      expect(result.order.totalAmount).toBe(160);
      expect(DiscountRepository.markCouponAsUsedByUser).toHaveBeenCalledWith(
        userId,
        discountCode
      );
    });

    it("rejects empty cart, bad codes, reuse, wrong nth order, and stock issues", async () => {
      const userId = "user-1";

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(null);
      await expect(CheckoutService.checkout(userId)).rejects.toThrow(
        "Cart is empty"
      );

      const mockCart: ICart = {
        id: "cart-1",
        userId,
        items: [{ itemId: "item-1", quantity: 1, price: 100 }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(mockCart);
      (DiscountRepository.findDiscountByCode as jest.Mock).mockReturnValue(
        undefined
      );
      await expect(
        CheckoutService.checkout(userId, "INVALID-CODE")
      ).rejects.toThrow("Invalid discount code");

      const usedCode: IDiscountCode = {
        code: "DISCOUNT-USED",
        discountPercentage: 20,
        nthOrder: 5,
        createdAt: new Date(),
      };
      (DiscountRepository.findDiscountByCode as jest.Mock).mockReturnValue(
        usedCode
      );
      (DiscountRepository.hasUserUsedCoupon as jest.Mock).mockReturnValue(true);
      await expect(
        CheckoutService.checkout(userId, "DISCOUNT-USED")
      ).rejects.toThrow("You have already used this discount code");

      (DiscountRepository.hasUserUsedCoupon as jest.Mock).mockReturnValue(false);
      (OrderRepository.getUserOrderCount as jest.Mock).mockReturnValue(2);
      await expect(
        CheckoutService.checkout(userId, "DISCOUNT-USED")
      ).rejects.toThrow(
        "This discount code is only valid for your 5th order"
      );

      (DiscountRepository.findDiscountByCode as jest.Mock).mockReturnValue(
        undefined
      );
      const mockItem: IItem = {
        id: "item-1",
        name: "Item 1",
        description: "Description",
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const overQtyCart: ICart = {
        ...mockCart,
        items: [{ itemId: "item-1", quantity: 100, price: 100 }],
      };
      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(overQtyCart);
      (ItemRepository.findItemById as jest.Mock).mockReturnValue(mockItem);
      await expect(CheckoutService.checkout(userId)).rejects.toThrow(
        "Insufficient stock"
      );
    });
  });
});
