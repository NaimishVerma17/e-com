import { z } from "zod";

export const addToCartSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    itemId: z.string().min(1, "Item ID is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
  }),
});
