import { Request, Response } from "express";
import { postProduct } from "../../src/controllers/productController";
import { products } from "../../src/models/product";
describe("postProduct", () => {
  beforeEach(() => {
    products.length = 0; // Clear the products array before each test
  });

  it("should create a new product and return it with no quantity", () => {
    const req = {
      body: { sku: "TESTSKU" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      sku: "TESTSKU",
      quantity: 0,
      updatedAt: products[0].getUpdatedAt().toISOString(),
    });
  });

  it("should create a new product and return it with 10 quantity", () => {
    const req = {
      body: { sku: "TESTSKU", quantity: 10 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      sku: "TESTSKU",
      quantity: 10,
      updatedAt: products[0].getUpdatedAt().toISOString(),
    });
  });

  it("should return 400 if sku is missing", () => {
    const req = {
      body: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku is required in body",
    });
  });

  it("should return 400 if quantity is not a number", () => {
    const req = {
      body: { sku: "TESTSKU", quantity: "notanumber" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity must be a number if provided in body",
    });
  });

  it("should return 409 if product with same sku already exists", () => {
    const req = {
      body: { sku: "TESTSKU", quantity: 10 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // First call to create the product
    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);

    // Second call with same sku should return 409
    postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product with this sku already exists",
    });
  });
});
