import { Router } from "express";
import {
  getProductBySku,
  getProducts,
  patchProduct,
  postProduct,
  putProduct,
} from "../controllers/productController";
import { authenticate } from "../middlewares/auth";

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
 *     ProductPutRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           example: 5
 *       required:
 *         - quantity
 *     ProductPatchRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           example: -5
 *         email:
 *           type: string
 *           example: "customer@example.com"
 *         orderId:
 *           type: string
 *           example: "ORD123456"
 *       required:
 *         - quantity
 *     ProductPatchDeltaRequest:
 *       type: object
 *       description: Quantity only delta update, not order related
 *       properties:
 *         quantity:
 *           type: number
 *           example: 5
 *       required:
 *         - quantity
 *       additionalProperties: false
 *     ProductPatchOrderRequest:
 *       type: object
 *       description: Order related update with email, orderId and a negative quantity
 *       properties:
 *         quantity:
 *           type: number
 *           example: -5
 *         email:
 *           type: string
 *           example: "customer@example.com"
 *         orderId:
 *           type: string
 *           example: "ORD123456"
 *       required:
 *         - quantity
 *         - email
 *         - orderId
 *       additionalProperties: false
 *     OrderUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Order ORD123456 processed for customer@example.com and email sent"
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
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
 */
router.get("/", getProducts);

/**
 * @openapi
 * /api/products/{sku}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by SKU
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
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
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
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
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
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
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
 *       409:
 *         description: Product with this SKU already exists
 */
router.post("/", authenticate, postProduct);

/**
 * @openapi
 * /api/products/{sku}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Set product quantity
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
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
 *             $ref: "#/components/schemas/ProductPutRequest"
 *     responses:
 *       200:
 *         description: Product quantity set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Invalid request body or missing SKU parameter
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
 *       404:
 *         description: Product not found
 */
router.put("/:sku", authenticate, putProduct);

/**
 * @openapi
 * /api/products/{sku}:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update product quantity by delta
 *     description: |
 *       Updates product quantity by delta. If `email` and `orderId` are provided together, this is treated as an order-related update.
 *       For order-related updates, `quantity` must be negative and sufficient stock must exist.
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
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
 *             oneOf:
 *               - $ref: "#/components/schemas/ProductPatchDeltaRequest"
 *               - $ref: "#/components/schemas/ProductPatchOrderRequest"
 *             description: Use one of the PATCH variants.
 *           examples:
 *             quantityDelta:
 *               summary: Quantity only delta update
 *               value:
 *                 quantity: 5
 *             orderUpdate:
 *               summary: Order related update
 *               value:
 *                 quantity: -5
 *                 email: "customer@example.com"
 *                 orderId: "ORD123456"
 *     responses:
 *       200:
 *         description: Product quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/Product"
 *                 - $ref: "#/components/schemas/OrderUpdateResponse"
 *       400:
 *         description: Invalid request body, missing SKU parameter, quantity is zero, email/orderId mismatch, or insufficient stock
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
 *       404:
 *         description: Product not found
 */
router.patch("/:sku", authenticate, patchProduct);

export default router;
