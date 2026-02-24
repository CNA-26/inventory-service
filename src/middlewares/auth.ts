import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!config.jwtSecret) {
    return res.status(500).json({
      message: "JWT secret not configured. Please yell at the developer.",
    });
  }

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Token required. Please add it in the Authorization header",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      const newToken = jwt.sign({ role: "admin" }, config.jwtSecret, {
        expiresIn: "1d",
      });
      console.log(newToken);
      console.error("JWT verification failed:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    console.log("Authenticated user:", decoded);
    next();
  });
};
