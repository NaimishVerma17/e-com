import * as ItemRepository from "../repositories/item.repository";
import { IItem } from "../types/item.type";

export const getAllItems = async (): Promise<IItem[]> => {
  return ItemRepository.findAllItems();
};

export const getItemById = async (itemId: string): Promise<IItem | null> => {
  const item = ItemRepository.findItemById(itemId);
  return item || null;
};
