import { itemStore } from "../models/item.model";
import { IItem } from "../types/item.type";

export const findItemById = (itemId: string): IItem | undefined => {
  return itemStore.findById(itemId);
};

export const findAllItems = (): IItem[] => {
  return itemStore.findAll();
};

export const updateItemStock = (
  itemId: string,
  quantity: number
): boolean => {
  return itemStore.updateStock(itemId, quantity);
};
