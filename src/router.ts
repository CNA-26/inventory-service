import express from "express";
import itemRoutes from "./routes/itemRoutes";

const router = express.Router();

router.use("/items", itemRoutes);

export default router;
