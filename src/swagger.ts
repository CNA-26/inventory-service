import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Service API",
      version: "1.0.0",
      description: "API documentation for the Inventory Service - BETA Version",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API Key for authentication. Use 'inventory-beta-key-2026' for BETA testing."
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Bearer token authentication. Use 'inventory-beta-key-2026' for BETA testing."
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
