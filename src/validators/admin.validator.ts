import { z } from "zod";

export const generateDiscountCodeSchema = z.object({
  body: z.object({
    nthOrder: z.number().int().positive("nthOrder must be a positive integer"),
    discountPercentage: z
      .number()
      .min(1, "Discount percentage must be at least 1")
      .max(100, "Discount percentage cannot exceed 100"),
  }),
});

export type GenerateDiscountCodeInput = z.infer<
  typeof generateDiscountCodeSchema
>["body"];
