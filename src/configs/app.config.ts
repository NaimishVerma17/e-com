import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  nthOrderForDiscount: parseInt(process.env.NTH_ORDER_FOR_DISCOUNT || "5", 10),
};
