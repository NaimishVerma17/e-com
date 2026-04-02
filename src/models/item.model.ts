import { IItem } from "../types/item.type";

class ItemStore {
  private items: Map<string, IItem> = new Map();

  constructor() {
    // Initialize with some sample items
    this.seedItems();
  }

  private seedItems(): void {
    const sampleItems: IItem[] = [
      {
        id: "item-1",
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones",
        price: 199.99,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "item-2",
        name: "Smart Watch",
        description: "Fitness tracking smartwatch with heart rate monitor",
        price: 299.99,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "item-3",
        name: "Laptop Stand",
        description: "Ergonomic aluminum laptop stand",
        price: 49.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "item-4",
        name: "Mechanical Keyboard",
        description: "RGB mechanical gaming keyboard",
        price: 149.99,
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "item-5",
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub with HDMI and card reader",
        price: 39.99,
        stock: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleItems.forEach((item) => {
      this.items.set(item.id, item);
    });
  }

  findById(id: string): IItem | undefined {
    return this.items.get(id);
  }

  findAll(): IItem[] {
    return Array.from(this.items.values());
  }

  updateStock(id: string, quantity: number): boolean {
    const item = this.items.get(id);
    if (!item || item.stock < quantity) {
      return false;
    }
    item.stock -= quantity;
    return true;
  }
}

export const itemStore = new ItemStore();
