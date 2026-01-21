import express from "express";
import router from "./router";
import swagger from "./swagger";
const server = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.SERVER_HOST || "localhost";
const PROTOCOL = process.env.PROTOCOL || "http";

export const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`;

server.use("/api", router);
swagger(server);

server.listen(PORT, () => {
  console.log(`Server is running at ${BASE_URL}`);
});
