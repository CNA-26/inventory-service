import { Request, Response } from "express";
import { getProducts } from "../../src/controllers/productController";
import { Product, products } from "../../src/models/product";

describe("getProducts", () => {
  beforeEach(() => {
    products.length = 0; // Clear the products array before each test
  });
  it("should return an empty array when no products exist", () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    getProducts(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return an array of products when multiple products exist", () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    products.push(new Product("TESTSKU1", 10));
    products.push(new Product("TESTSKU2", 20));

    getProducts(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([
      {
        sku: "TESTSKU1",
        quantity: 10,
        updatedAt: products[0].getUpdatedAt().toISOString(),
      },
      {
        sku: "TESTSKU2",
        quantity: 20,
        updatedAt: products[1].getUpdatedAt().toISOString(),
      },
    ]);
  });
});
