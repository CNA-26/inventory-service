import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product";
import { sendShippingEmail } from "../services/emailService";

/**
 * Checks if a product exists by sku.
 * @param sku string sku of the product to check
 * @returns Promise<boolean> indicating whether the product exists
 */
const doesProductExist = async (sku: string): Promise<boolean> => {
  const product = await Product.findBySku(sku);
  return product !== null;
};

// Create a product
export const postProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sku, quantity } = req.body;

    if (!sku) {
      res.status(400).json({ message: "sku is required in body" });
      return;
    }

    if (quantity !== undefined && typeof quantity !== "number") {
      res
        .status(400)
        .json({ message: "quantity must be a number if provided in body" });
      return;
    }

    if (await doesProductExist(sku)) {
      res.status(409).json({ message: "Product with this sku already exists" });
      return;
    }

    const newProduct = await Product.create(sku, quantity || 0);
    res.status(201).json(newProduct.getProductInfo());
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.findAll();
    res.json(products.map((product) => product.getProductInfo()));
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProductBySku = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const skuParam = Array.isArray(req.params.sku)
      ? req.params.sku[0]
      : req.params.sku;
    if (!skuParam) {
      res.status(400).json({ message: "sku parameter is required" });
      return;
    }

    const product = await Product.findBySku(skuParam);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product.getProductInfo());
  } catch (error) {
    next(error);
  }
};

// set quantity of a product
export const putProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const skuParam = Array.isArray(req.params.sku)
      ? req.params.sku[0]
      : req.params.sku;
    if (!skuParam) {
      res.status(400).json({ message: "sku parameter is required" });
      return;
    }
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== "number") {
      res
        .status(400)
        .json({ message: "quantity is required in body and must be a number" });
      return;
    }

    const product = await Product.findBySku(skuParam);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    product.setQuantity(quantity);
    await product.update();
    res.json(product.getProductInfo());
  } catch (error) {
    next(error);
  }
};

// update quantity of a product
export const patchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const skuParam = Array.isArray(req.params.sku)
      ? req.params.sku[0]
      : req.params.sku;
    if (!skuParam) {
      res.status(400).json({ message: "sku parameter is required" });
      return;
    }
    const { quantity, email, orderId } = req.body;
    if (quantity === undefined || typeof quantity !== "number") {
      res
        .status(400)
        .json({ message: "quantity is required in body and must be a number" });
      return;
    }

    if (quantity === 0) {
      res
        .status(400)
        .json({ message: "quantity must be a non-zero number in body" });
      return;
    }
    const product = await Product.findBySku(skuParam);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (email !== undefined && typeof email !== "string") {
      res
        .status(400)
        .json({ message: "email must be a string if provided in body" });
      return;
    }

    if (orderId !== undefined && typeof orderId !== "string") {
      res
        .status(400)
        .json({ message: "orderId must be a string if provided in body" });
      return;
    }

    if (
      (email !== undefined && orderId === undefined) ||
      (email === undefined && orderId !== undefined)
    ) {
      res.status(400).json({
        message: "Both email and orderId must be provided for order updates",
      });
      return;
    }

    let orderRelatedUpdate = false;
    if (email !== undefined && orderId !== undefined) {
      orderRelatedUpdate = true;
    }

    if (quantity > 0 && orderRelatedUpdate) {
      res.status(400).json({
        message: `If quantity is positive, email and orderId should not be provided`,
      });
      return;
    }

    if (!orderRelatedUpdate) {
      product.setQuantity(product.getQuantity() + quantity);
      await product.update();
      res.json(product.getProductInfo());
      return;
    }

    if (product.getQuantity() + quantity < 0) {
      res.status(400).json({
        message: `Insufficient stock to fulfill order ${orderId} for ${email}`,
      });
      return;
    }

    try {
      await sendShippingEmail(email, orderId, `trackingNumber-${orderId}`);
    } catch {
      return res.status(502).json({
        message: `Order ${orderId} could not be completed because email failed`,
      });
    }

    product.setQuantity(product.getQuantity() + quantity);
    await product.update();

    res.json({
      message: `Order ${orderId} processed for ${email} and email sent`,
    });
  } catch (error) {
    next(error);
  }
};
