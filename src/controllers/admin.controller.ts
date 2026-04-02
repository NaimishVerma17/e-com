import { Request, Response } from "express";

import { STATUS_CODES } from "../constants/status";
import * as AdminService from "../services/admin.service";

export const getStatistics = async (req: Request, res: Response) => {
  const stats = await AdminService.getStatistics();
  res.status(STATUS_CODES.OK).json({
    message: "Statistics retrieved successfully",
    stats,
  });
};

export const generateDiscountCode = async (req: Request, res: Response) => {
  const { nthOrder, discountPercentage } = req.body;
  const result = await AdminService.generateDiscountCodeManually(
    nthOrder,
    discountPercentage
  );
  res.status(STATUS_CODES.CREATED).json({
    message: result.message,
    discountCode: result.discountCode,
  });
};
