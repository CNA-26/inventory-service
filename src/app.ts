import express from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./router";
import swaggerSpec from "./swagger";

const app = express();

app.use(express.json());

// Routes
app.use("/api", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
