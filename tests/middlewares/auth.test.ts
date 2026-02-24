import jwt from "jsonwebtoken";
let authenticate: any;

describe("Authentication Middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    jest.resetModules();
    authenticate = require("../../src/middlewares/auth").authenticate;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() with valid Bearer token", () => {
    const token = jwt.sign({ role: "admin" }, "test-secret", {
      expiresIn: "1d",
    });
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    const req: any = { headers: { authorization: undefined } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token required. Please add it in the Authorization header",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    const req: any = { headers: { authorization: `Bearer invalidtoken` } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
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
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Insufficient permissions",
    });
  });
});
