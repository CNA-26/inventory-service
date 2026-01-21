import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Service API",
      version: "1.0.0",
      description: "API documentation for the Inventory Service",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
