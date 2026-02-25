import express from "express";
import productRoutes from "./routes/productRoutes";

const router = express.Router();

// Apply authentication to all API routes
router.use("/products", productRoutes);

export default router;
