import express from "express";
import swaggerUi from "swagger-ui-express";
import { AppError, errorHandler } from "./middlewares/errorHandler";
import router from "./router";
import swaggerSpec from "./swagger";
import { Product } from "./models/product";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Initialize database
const initializeDatabase = async () => {
  try {
    await Product.createTable();
    await Product.seedInitialData();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

// Initialize database on startup
initializeDatabase();

// Custom JSON parsing error handler
app.use(
  (
    err: AppError,
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
app.get("/", (req, res) => {
  res.json({
    message:
      "If you are seeing this message the server is running. Please refer to /docs for API documentation.",
  });
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
