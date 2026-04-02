import { Request, Response } from "express";

import { STATUS_CODES } from "../constants/status";
import * as ItemService from "../services/item.service";

export const getAllItems = async (req: Request, res: Response) => {
  const items = await ItemService.getAllItems();
  res.status(STATUS_CODES.OK).json({
    message: "Items retrieved successfully",
    items,
  });
};

export const getItemById = async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;
  const item = await ItemService.getItemById(itemId);

  if (!item) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      message: "Item not found",
    });
    return;
  }

  res.status(STATUS_CODES.OK).json({
    message: "Item retrieved successfully",
    item,
  });
};
