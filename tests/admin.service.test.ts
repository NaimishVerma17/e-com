import * as DiscountRepository from "../src/repositories/discount.repository";
import * as OrderRepository from "../src/repositories/order.repository";
import * as AdminService from "../src/services/admin.service";
import { IDiscountCode } from "../src/types/discount.type";

jest.mock("../src/repositories/discount.repository");
jest.mock("../src/repositories/order.repository");

describe("AdminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStatistics", () => {
    it("aggregates order metrics and lists discount codes", async () => {
      const mockOrderStats = {
        totalOrders: 10,
        totalItemsPurchased: 25,
        totalRevenue: 2500,
        totalDiscountGiven: 150,
      };

      const mockDiscountCodes: IDiscountCode[] = [
        {
          code: "DISCOUNT-ABC123",
          discountPercentage: 15,
          nthOrder: 5,
          createdAt: new Date(),
        },
        {
          code: "DISCOUNT-XYZ789",
          discountPercentage: 20,
          nthOrder: 10,
          createdAt: new Date(),
        },
      ];

      (OrderRepository.getOrderStats as jest.Mock).mockReturnValue(
        mockOrderStats
      );
      (DiscountRepository.findAllDiscountCodes as jest.Mock).mockReturnValue(
        mockDiscountCodes
      );

      const stats = await AdminService.getStatistics();

      expect(stats.totalOrders).toBe(10);
      expect(stats.totalItemsPurchased).toBe(25);
      expect(stats.totalRevenue).toBe(2500);
      expect(stats.totalDiscountGiven).toBe(150);
      expect(stats.discountCodes).toHaveLength(2);
    });
  });

  describe("generateDiscountCodeManually", () => {
    it("creates a code with the given nth order and percentage", async () => {
      const nthOrder = 5;
      const discountPercentage = 15;

      (DiscountRepository.createDiscountCode as jest.Mock).mockImplementation(
        (code, percentage, nth) => ({
          code,
          discountPercentage: percentage,
          nthOrder: nth,
          createdAt: new Date(),
        })
      );

      const result = await AdminService.generateDiscountCodeManually(
        nthOrder,
        discountPercentage
      );

      expect(result.discountCode.code).toMatch(/^DISCOUNT-[A-Z0-9]{6}$/);
      expect(result.discountCode.discountPercentage).toBe(15);
      expect(result.discountCode.nthOrder).toBe(5);
      expect(result.message).toContain("5th order");
      expect(result.message).toContain("15%");
      expect(DiscountRepository.createDiscountCode).toHaveBeenCalledWith(
        expect.stringMatching(/^DISCOUNT-[A-Z0-9]{6}$/),
        15,
        5
      );
    });
  });
});
