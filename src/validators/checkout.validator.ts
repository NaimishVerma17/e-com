import { z } from "zod";

export const checkoutSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    discountCode: z.string().optional(),
  }),
});