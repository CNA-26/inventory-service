import { Request, Response } from "express";
import { authenticate } from "../../src/middlewares/auth";

describe("Authentication Middleware", () => {
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() with valid X-API-Key header", () => {
    const req = {
      headers: {
        'x-api-key': 'inventory-beta-key-2026'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    authenticate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call next() with valid Bearer token", () => {
    const req = {
      headers: {
        'authorization': 'Bearer inventory-beta-key-2026'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    authenticate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 when no API key is provided", () => {
    const req = {
      headers: {}
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'API key required. Use X-API-Key header or Authorization header'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 with invalid API key", () => {
    const req = {
      headers: {
        'x-api-key': 'invalid-key'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid API key'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});