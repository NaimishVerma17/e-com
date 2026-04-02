/**
 * Generates a random discount code
 * Format: DISCOUNT-XXXXXX (where X is alphanumeric)
 */
export const generateDiscountCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "DISCOUNT-";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

/**
 * Generates a random discount percentage between min and max
 */
export const generateDiscountPercentage = (
  min: number = 10,
  max: number = 25
): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
