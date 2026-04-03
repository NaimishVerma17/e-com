import * as CartRepository from "../src/repositories/cart.repository";
import * as ItemRepository from "../src/repositories/item.repository";
import * as CartService from "../src/services/cart.service";
import { ICart } from "../src/types/cart.type";
import { IItem } from "../src/types/item.type";
import { AppError } from "../src/utils/appError";

jest.mock("../src/repositories/cart.repository");
jest.mock("../src/repositories/item.repository");

describe("CartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addItemToCart", () => {
    it("adds line items and totals on an existing cart", async () => {
      const userId = "user-1";
      const itemId = "item-1";
      const quantity = 2;

      const mockItem: IItem = {
        id: itemId,
        name: "Test Item",
        description: "Description",
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCart: ICart = {
        id: "cart-1",
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCart: ICart = {
        ...mockCart,
        items: [{ itemId, quantity, price: 100 }],
      };

      (ItemRepository.findItemById as jest.Mock).mockReturnValue(mockItem);
      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(mockCart);
      (CartRepository.addItemToCart as jest.Mock).mockReturnValue(updatedCart);

      const result = await CartService.addItemToCart(userId, itemId, quantity);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].itemId).toBe(itemId);
      expect(result.items[0].quantity).toBe(quantity);
      expect(result.totalAmount).toBe(200);
    });

    it("creates a cart when the user has none", async () => {
      const userId = "user-1";
      const itemId = "item-1";
      const quantity = 1;

      const mockItem: IItem = {
        id: itemId,
        name: "Test Item",
        description: "Description",
        price: 50,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCart: ICart = {
        id: "cart-1",
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCart: ICart = {
        ...newCart,
        items: [{ itemId, quantity, price: 50 }],
      };

      (ItemRepository.findItemById as jest.Mock).mockReturnValue(mockItem);
      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(null);
      (CartRepository.createCart as jest.Mock).mockReturnValue(newCart);
      (CartRepository.addItemToCart as jest.Mock).mockReturnValue(updatedCart);

      const result = await CartService.addItemToCart(userId, itemId, quantity);

      expect(CartRepository.createCart).toHaveBeenCalledWith(userId);
      expect(result.totalAmount).toBe(50);
    });

    it("rejects missing items and insufficient stock", async () => {
      (ItemRepository.findItemById as jest.Mock).mockReturnValue(undefined);

      await expect(
        CartService.addItemToCart("user-1", "missing", 1)
      ).rejects.toThrow(AppError);
      await expect(
        CartService.addItemToCart("user-1", "missing", 1)
      ).rejects.toThrow("Item not found");

      const lowStockItem: IItem = {
        id: "item-1",
        name: "Test Item",
        description: "Description",
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (ItemRepository.findItemById as jest.Mock).mockReturnValue(lowStockItem);

      await expect(
        CartService.addItemToCart("user-1", "item-1", 20)
      ).rejects.toThrow("Insufficient stock available");
    });
  });

  describe("getCartByUserId", () => {
    it("returns the cart with total or null", async () => {
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

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(mockCart);

      const withCart = await CartService.getCartByUserId(userId);
      expect(withCart).not.toBeNull();
      expect(withCart?.totalAmount).toBe(250);

      (CartRepository.findCartByUserId as jest.Mock).mockReturnValue(null);
      const none = await CartService.getCartByUserId(userId);
      expect(none).toBeNull();
    });
  });
});
