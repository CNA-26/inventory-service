import express from "express";
import productRoutes from "./routes/productRoutes";

const router = express.Router();

router.use("/products", productRoutes);
export default router;
