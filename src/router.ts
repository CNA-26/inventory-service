import express from "express";
import productRoutes from "./routes/productRoutes";
import { authenticate } from "./middlewares/auth";

const router = express.Router();

// Apply authentication to all API routes
router.use("/products", authenticate, productRoutes);

export default router;
