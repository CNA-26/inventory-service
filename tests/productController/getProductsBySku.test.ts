import { Request, Response } from "express";
import { getProductBySku } from "../../src/controllers/productController";
import { Product, products } from "../../src/models/product";
describe("getProductBySku", () => {
  beforeEach(() => {
    products.length = 0; // Clear the products array before each test
  });
  it("should return a single product if called with a specific sku", () => {
    const req = {
      params: { sku: "TESTSKU1" },
    } as unknown as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU1", 10));
    products.push(new Product("TESTSKU2", 20));

    getProductBySku(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({
      sku: "TESTSKU1",
      quantity: 10,
      updatedAt: products[0].getUpdatedAt().toISOString(),
    });
  });

  it("should not find a product if called with a non-existing sku", () => {
    const req = {
      params: { sku: "NONEXISTENTSKU" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU1", 10));
    products.push(new Product("TESTSKU2", 20));

    getProductBySku(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it("should return 400 if sku parameter is missing", () => {
    const req = {
      params: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    getProductBySku(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku parameter is required",
    });
  });
});
