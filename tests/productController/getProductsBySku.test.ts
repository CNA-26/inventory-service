import { Request, Response } from "express";
import { getProductBySku } from "../../src/controllers/productController";
import { Product } from "../../src/models/product";

jest.mock("../../src/models/product");

describe("getProductBySku", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a single product if called with a specific sku", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    const mockProduct = {
      getProductInfo: jest.fn().mockReturnValue({
        sku: "TESTSKU1",
        quantity: 10,
        updatedAt: new Date().toISOString(),
      }),
    };
    mockFindBySku.mockResolvedValue(mockProduct as any);

    const req = {
      params: { sku: "TESTSKU1" },
    } as unknown as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await getProductBySku(req, res, jest.fn());
    expect(res.json).toHaveBeenCalled();
    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.sku).toBe("TESTSKU1");
    expect(call.quantity).toBe(10);
  });

  it("should not find a product if called with a non-existing sku", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    mockFindBySku.mockResolvedValue(null);

    const req = {
      params: { sku: "NONEXISTENTSKU" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getProductBySku(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it("should return 400 if sku parameter is missing", async () => {
    const req = {
      params: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getProductBySku(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku parameter is required",
    });
  });
});
