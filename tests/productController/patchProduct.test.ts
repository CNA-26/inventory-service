import { Request, Response } from "express";
import { patchProduct } from "../../src/controllers/productController";
import { Product, products } from "../../src/models/product";
describe("patchProduct", () => {
  beforeEach(() => {
    products.length = 0; // Clear the products array before each test
  });

  it("should update the quantity negatively of an existing product and return it", () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU", 10));

    patchProduct(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({
      sku: "TESTSKU",
      quantity: 5,
      updatedAt: products[0].getUpdatedAt().toISOString(),
    });
  });

  it("should update the quantity positively of an existing product and return it", () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: 5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU", 10));

    patchProduct(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({
      sku: "TESTSKU",
      quantity: 15,
      updatedAt: products[0].getUpdatedAt().toISOString(),
    });
  });

  it("should return 404 if product does not exist", () => {
    const req = {
      params: { sku: "NONEXISTENTSKU" },
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product not found",
    });
  });

  it("should return 400 if quantity is missing or not a number", () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU", 10));

    patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity is required in body and must be a number",
    });
  });

  it("should return 400 if sku parameter is missing", () => {
    const req = {
      params: {},
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku parameter is required",
    });
  });
});
