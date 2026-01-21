import { Router } from "express";
import statusRouter from "./routes/status";

const router = Router();

router.use("/status", statusRouter);

export default router;
