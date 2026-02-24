import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

let authenticate: (req: Request, res: Response, next: NextFunction) => void;

describe("Authentication Middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    jest.resetModules();
    authenticate = jest.requireActual(
      "../../src/middlewares/auth",
    ).authenticate;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() with valid Bearer token", () => {
    const token = jwt.sign({ role: "admin" }, "test-secret", {
      expiresIn: "1d",
    });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    const req = { headers: { authorization: undefined } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token required. Please add it in the Authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    const req = {
      headers: { authorization: `Bearer invalidtoken` },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // eturn res.status(403).json({ message: "Insufficient permissions" });
  it("should return 403 for insufficient permissions", () => {
    const token = jwt.sign({ role: "user" }, "test-secret", {
      expiresIn: "1d",
    });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Insufficient permissions",
    });
  });
});
