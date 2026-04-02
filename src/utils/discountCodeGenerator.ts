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
