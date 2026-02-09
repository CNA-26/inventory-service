import { Router } from "express";
import {
  getProductBySku,
  getProducts,
  patchProduct,
  postProduct,
  putProduct,
} from "../controllers/productController";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: "ABC123"
 *         quantity:
 *           type: number
 *           example: 10
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-02-09T10:00:00.000Z"
 *       required:
 *         - sku
 *         - quantity
 *         - updatedAt
 *     ProductCreateRequest:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: "ABC123"
 *         quantity:
 *           type: number
 *           example: 10
 *       required:
 *         - sku
 *     ProductUpdateRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           example: 5
 *       required:
 *         - quantity
 * tags:
 *   - name: Products
 *     description: Product inventory management
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
router.get("/", getProducts);

/**
 * @openapi
 * /api/products/{sku}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by SKU
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Missing SKU parameter
 *       404:
 *         description: Product not found
 */
router.get("/:sku", getProductBySku);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProductCreateRequest"
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Product with this SKU already exists
 */
router.post("/", postProduct);

/**
 * @openapi
 * /api/products/{sku}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Set product quantity
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProductUpdateRequest"
 *     responses:
 *       200:
 *         description: Product quantity set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Invalid request body or missing SKU parameter
 *       404:
 *         description: Product not found
 */
router.put("/:sku", putProduct);

/**
 * @openapi
 * /api/products/{sku}:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update product quantity by delta
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProductUpdateRequest"
 *     responses:
 *       200:
 *         description: Product quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Invalid request body or missing SKU parameter
 *       404:
 *         description: Product not found
 */
router.patch("/:sku", patchProduct);

export default router;
