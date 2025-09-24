// apps/backend/src/routes/predictions.ts
import { FastifyInstance } from "fastify";
import { predictMatch } from "../services/predictionService";

export async function predictionRoutes(server: FastifyInstance) {
  server.get("/predictions", async (request, reply) => {
    try {
      // Example: take query params
      const { homeTeam, awayTeam } = request.query as {
        homeTeam: string;
        awayTeam: string;
      };

      if (!homeTeam || !awayTeam) {
        return reply.status(400).send({ error: "Missing team names" });
      }

      const result = await predictMatch(homeTeam, awayTeam);

      return { success: true, data: result };
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || "Prediction error",
      });
    }
  });
}