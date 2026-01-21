import type { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swagger = (server: Express) => {
  const definition = {
    openapi: "3.0.0",
    info: {
      title: "Inventory Service API",
      version: "1.0.0",
      description: "API documentation for the Inventory Service",
    },
  };

  const options = {
    definition,
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);
  server.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swagger;
