import { FastifyInstance } from "fastify";
import { runPrediction } from "../services/predictionService";

export async function predictionRoutes(server: FastifyInstance) {
  server.get("/api/predictions", async () => {
    return { message: "Send POST /api/predictions with match features" };
  });

  server.post("/api/predictions", async (req, reply) => {
    const { features } = req.body as { features: number[] };
    if (!features || !Array.isArray(features))
      return reply.status(400).send({ error: "Invalid features array" });

    try {
      const prediction = await runPrediction(features);
      return { prediction }; // array of probabilities [home_win, draw, away_win]
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Prediction failed" });
    }
  });
}