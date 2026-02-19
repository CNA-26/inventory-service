import { Request, Response, NextFunction } from "express";
import config from "../config/config";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // If no API key is configured, skip authentication (for development)
  if (!config.apiKey || config.apiKey.trim() === '') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];

  if (!apiKey) {
    return res.status(401).json({
      message: 'API key required. Use X-API-Key header or Authorization header'
    });
  }

  // Check if it's a Bearer token or direct API key
  const providedKey = typeof apiKey === 'string' && apiKey.startsWith('Bearer ')
    ? apiKey.substring(7)
    : apiKey;

  if (providedKey !== config.apiKey) {
    return res.status(403).json({
      message: 'Invalid API key'
    });
  }

  next();
};;