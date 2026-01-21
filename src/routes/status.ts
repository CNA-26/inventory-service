import { Router } from "express";

const statusRouter = Router();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the status of the service
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
statusRouter.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default statusRouter;
