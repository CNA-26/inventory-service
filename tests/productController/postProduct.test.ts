import { Request, Response } from "express";
import { postProduct } from "../../src/controllers/productController";
import { Product } from "../../src/models/product";

jest.mock("../../src/models/product");

describe("postProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new product and return it with no quantity", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    const mockCreate = Product.create as jest.MockedFunction<
      typeof Product.create
    >;
    mockFindBySku.mockResolvedValue(null);

    const mockProduct = {
      getProductInfo: jest.fn().mockReturnValue({
        sku: "TESTSKU",
        quantity: 0,
        updatedAt: new Date().toISOString(),
      }),
    } as unknown as Product;
    mockCreate.mockResolvedValue(mockProduct);

    const req = {
      body: { sku: "TESTSKU" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.sku).toBe("TESTSKU");
    expect(call.quantity).toBe(0);
  });

  it("should create a new product and return it with 10 quantity", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    const mockCreate = Product.create as jest.MockedFunction<
      typeof Product.create
    >;
    mockFindBySku.mockResolvedValue(null);

    const mockProduct = {
      getProductInfo: jest.fn().mockReturnValue({
        sku: "TESTSKU",
        quantity: 10,
        updatedAt: new Date().toISOString(),
      }),
    } as unknown as Product;
    mockCreate.mockResolvedValue(mockProduct);

    const req = {
      body: { sku: "TESTSKU", quantity: 10 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.sku).toBe("TESTSKU");
    expect(call.quantity).toBe(10);
  });

  it("should return 400 if sku is missing", async () => {
    const req = {
      body: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku is required in body",
    });
  });

  it("should return 400 if quantity is not a number", async () => {
    const req = {
      body: { sku: "TESTSKU", quantity: "notanumber" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity must be a number if provided in body",
    });
  });

  it("should return 409 if product with same sku already exists", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    mockFindBySku.mockResolvedValue(new Product(1, "TESTSKU", 10, new Date()));

    const req = {
      body: { sku: "TESTSKU", quantity: 10 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await postProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product with this sku already exists",
    });
  });
});
