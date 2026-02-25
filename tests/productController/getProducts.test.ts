import { Request, Response } from "express";
import { getProducts } from "../../src/controllers/productController";
import { Product } from "../../src/models/product";

// Mock the database operations
jest.mock("../../src/models/product");

describe("getProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array when no products exist", async () => {
    const mockFindAll = Product.findAll as jest.MockedFunction<typeof Product.findAll>;
    mockFindAll.mockResolvedValue([]);

    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await getProducts(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return an array of products when multiple products exist", async () => {
    const mockProduct1 = new Product(1, "TESTSKU1", 10, new Date());
    const mockProduct2 = new Product(2, "TESTSKU2", 20, new Date());

    const mockFindAll = Product.findAll as jest.MockedFunction<typeof Product.findAll>;
    mockFindAll.mockResolvedValue([mockProduct1, mockProduct2]);

    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await getProducts(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([
      mockProduct1.getProductInfo(),
      mockProduct2.getProductInfo(),
    ]);
  });
});
