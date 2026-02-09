import { Product } from "../src/models/product";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Product class", () => {
  it("should create a product with the correct properties", () => {
    const product = new Product("TESTSKU", 10);
    expect(product.getSku()).toBe("TESTSKU");
    expect(product.getQuantity()).toBe(10);
    expect(product.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it("should update quantity positively and updatedAt when updateQuantity is called", async () => {
    const product = new Product("TESTSKU", 10);
    const originalUpdatedAt = product.getUpdatedAt();
    await wait(10);
    product.updateQuantity(5);
    expect(product.getQuantity()).toBe(15);
    expect(product.getUpdatedAt()).toBeInstanceOf(Date);
    expect(product.getUpdatedAt().getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it("should update quantity negatively and updatedAt when updateQuantity is called", async () => {
    const product = new Product("TESTSKU", 10);
    const originalUpdatedAt = product.getUpdatedAt();
    await wait(10);
    product.updateQuantity(-3);
    expect(product.getQuantity()).toBe(7);
    expect(product.getUpdatedAt()).toBeInstanceOf(Date);
    expect(product.getUpdatedAt().getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it("should set quantity and updatedAt when setQuantity is called", async () => {
    const product = new Product("TESTSKU", 10);
    const originalUpdatedAt = product.getUpdatedAt();
    await wait(10);
    product.setQuantity(20);
    expect(product.getQuantity()).toBe(20);
    expect(product.getUpdatedAt()).toBeInstanceOf(Date);
    expect(product.getUpdatedAt().getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it("should return correct product info", () => {
    const product = new Product("TESTSKU", 10);
    const info = product.getProductInfo();
    expect(info).toHaveProperty("sku", "TESTSKU");
    expect(info).toHaveProperty("quantity", 10);
    expect(info).toHaveProperty("updatedAt");
    expect(new Date(info.updatedAt)).toBeInstanceOf(Date);
  });
});
