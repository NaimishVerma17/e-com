import {
  generateDiscountCode,
  generateDiscountPercentage,
} from "../src/utils/discountCodeGenerator";

describe("DiscountCodeGenerator", () => {
  describe("generateDiscountCode", () => {
    it("produces DISCOUNT- plus six alphanumerics", () => {
      const code = generateDiscountCode();
      expect(code).toMatch(/^DISCOUNT-[A-Z0-9]{6}$/);
    });
  });

  describe("generateDiscountPercentage", () => {
    it("returns an integer in the given inclusive range", () => {
      for (let i = 0; i < 20; i++) {
        const p = generateDiscountPercentage();
        expect(Number.isInteger(p)).toBe(true);
        expect(p).toBeGreaterThanOrEqual(10);
        expect(p).toBeLessThanOrEqual(25);
      }
      expect(generateDiscountPercentage(5, 15)).toBeGreaterThanOrEqual(5);
      expect(generateDiscountPercentage(5, 15)).toBeLessThanOrEqual(15);
      expect(generateDiscountPercentage(20, 20)).toBe(20);
    });
  });
});
