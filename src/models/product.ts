export interface ProductInterface {
  getQuantity(): number;
  getSku(): string;
  getUpdatedAt(): Date;

  setQuantity(quantity: number): void;
}

export type ProductInfo = {
  sku: string;
  quantity: number;
  updatedAt: string;
};

export class Product implements ProductInterface {
  private id: number;
  private quantity: number;
  private sku: string;
  private updatedAt: Date;

  constructor(sku: string, quantity: number = 0) {
    if (products) {
      this.id = products.length + 1;
    } else {
      this.id = 1;
    }
    this.quantity = quantity;
    this.sku = sku;
    this.updatedAt = new Date();
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSku(): string {
    return this.sku;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateQuantity(quantityChange: number): void {
    this.quantity += quantityChange;
    this.updatedAt = new Date();
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
    this.updatedAt = new Date();
  }

  getProductInfo(): ProductInfo {
    return {
      sku: this.sku,
      quantity: this.quantity,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export const products: Product[] = [
  new Product("PLACEHOLDER001", 10),
  new Product("PLACEHOLDER002", 20),
  new Product("PLACEHOLDER003", 0),
  new Product("PLACEHOLDER004", 5),
];
