import pool from "../config/database";

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

export type DbRow = {
  id: number;
  sku: string;
  quantity: number;
  updated_at: string | Date;
};

export class Product implements ProductInterface {
  private id: number;
  private quantity: number;
  private sku: string;
  private updatedAt: Date;

  constructor(id: number, sku: string, quantity: number, updatedAt: Date) {
    this.id = id;
    this.quantity = quantity;
    this.sku = sku;
    this.updatedAt = updatedAt;
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

  // Database operations
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(255) UNIQUE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  }

  static async findAll(): Promise<Product[]> {
    const query = "SELECT id, sku, quantity, updated_at FROM products ORDER BY id";
    const result = await pool.query(query);
    return result.rows.map((row: DbRow) => new Product(row.id, row.sku, row.quantity, new Date(row.updated_at)));
  }

  static async findBySku(sku: string): Promise<Product | null> {
    const query = "SELECT id, sku, quantity, updated_at FROM products WHERE sku = $1";
    const result = await pool.query(query, [sku]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new Product(row.id, row.sku, row.quantity, new Date(row.updated_at));
  }

  static async create(sku: string, quantity: number = 0): Promise<Product> {
    const query = "INSERT INTO products (sku, quantity) VALUES ($1, $2) RETURNING id, sku, quantity, updated_at";
    const result = await pool.query(query, [sku, quantity]);
    const row = result.rows[0];
    return new Product(row.id, row.sku, row.quantity, new Date(row.updated_at));
  }

  async update(): Promise<void> {
    const query = "UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2";
    await pool.query(query, [this.quantity, this.id]);
    this.updatedAt = new Date();
  }

  async delete(): Promise<void> {
    const query = "DELETE FROM products WHERE id = $1";
    await pool.query(query, [this.id]);
  }

  static async seedInitialData(): Promise<void> {
    const existingProducts = await this.findAll();
    if (existingProducts.length === 0) {
      await this.create("PLACEHOLDER001", 10);
      await this.create("PLACEHOLDER002", 20);
      await this.create("PLACEHOLDER003", 0);
      await this.create("PLACEHOLDER004", 5);
      console.log("Initial product data seeded");
    }
  }
}
