import { Request, Response } from "express";
import { patchProduct } from "../../src/controllers/productController";
import { Product } from "../../src/models/product";

jest.mock("../../src/models/product");

describe("patchProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the quantity negatively of an existing product and return it", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    const mockProduct = {
      getQuantity: jest.fn().mockReturnValue(10),
      setQuantity: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      getProductInfo: jest.fn().mockReturnValue({
        sku: "TESTSKU",
        quantity: 5,
        updatedAt: new Date().toISOString(),
      }),
    };
    mockFindBySku.mockResolvedValue(mockProduct as any);

    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.json).toHaveBeenCalled();
    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.sku).toBe("TESTSKU");
    expect(call.quantity).toBe(5);
  });

  it("should update the quantity positively of an existing product and return it", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    const mockProduct = {
      getQuantity: jest.fn().mockReturnValue(10),
      setQuantity: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      getProductInfo: jest.fn().mockReturnValue({
        sku: "TESTSKU",
        quantity: 15,
        updatedAt: new Date().toISOString(),
      }),
    };
    mockFindBySku.mockResolvedValue(mockProduct as any);

    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: 5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.json).toHaveBeenCalled();
    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.sku).toBe("TESTSKU");
    expect(call.quantity).toBe(15);
  });

  it("should return 404 if product does not exist", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    mockFindBySku.mockResolvedValue(null);

    const req = {
      params: { sku: "NONEXISTENTSKU" },
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product not found",
    });
  });

  it("should return 400 if quantity is missing or not a number", async () => {
    const mockFindBySku = Product.findBySku as jest.MockedFunction<
      typeof Product.findBySku
    >;
    mockFindBySku.mockResolvedValue(new Product(1, "TESTSKU", 10, new Date()));

    const req = {
      params: { sku: "TESTSKU" },
      body: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity is required in body and must be a number",
    });
  });

  it("should return 400 if sku parameter is missing", async () => {
    const req = {
      params: {},
      body: { quantity: -5 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "sku parameter is required",
    });
  });

  it("should return 400 if quantity is 0", async () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: 0 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity must be a non-zero number in body",
    });
  });

  it("should return 400 if email and orderId are provided but quantity is 0", async () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: 0, email: "test@example.com", orderId: "ORDER123" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "quantity must be a non-zero number in body",
    });
  });

  it("should return 400 if email and orderId are provided but quantity is positive", async () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: 5, email: "test@example.com", orderId: "ORDER123" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "If quantity is positive, email and orderId should not be provided",
    });
  });
  it("should return 400 if only email is provided with negative quantity", async () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: -5, email: "test@example.com" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Both email and orderId must be provided for order updates",
    });
  });

  it("should send shipping notification email and return 200 for valid order update", async () => {
    const req = {
      params: { sku: "TESTSKU" },
      body: { quantity: -5, email: "test@example.com", orderId: "ORDER123" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await patchProduct(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({
      message: "Order ORDER123 processed for test@example.com and email sent",
    });
  });
});
