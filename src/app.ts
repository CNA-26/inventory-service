import express from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./router";
import swaggerSpec from "./swagger";

const app = express();

app.use(express.json());

// Custom JSON parsing error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ message: "Invalid JSON in request body" });
      return;
    }
    next(err);
  },
);

// Routes
app.use("/api", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
