import { FastifyInstance } from "fastify";
import { PredictionModel } from "../models/Prediction";
import { MatchModel } from "../models/Match";

export async function predictionRoutes(server: FastifyInstance) {
  // GET all predictions
  server.get("/api/predictions", async (request, reply) => {
    try {
      const predictions = await PredictionModel.find().populate("matchId");
      return predictions;
    } catch (err) {
      reply.status(500).send({ error: "Failed to fetch predictions" });
    }
  });

  // POST a new prediction (mock AI for now)
  server.post("/api/predictions", async (request, reply) => {
    try {
      const { matchId } = request.body;

      // Fetch the match
      const match = await MatchModel.findById(matchId);
      if (!match) return reply.status(404).send({ error: "Match not found" });

      // Mock AI: random prediction
      const outcomes: Array<"home" | "draw" | "away"> = ["home", "draw", "away"];
      const predictedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      const confidence = parseFloat((Math.random() * (0.9 - 0.5) + 0.5).toFixed(2)); // 50%-90%

      const prediction = new PredictionModel({ matchId, predictedOutcome, confidence });
      await prediction.save();

      return prediction;
    } catch (err) {
      reply.status(400).send({ error: "Failed to create prediction" });
    }
  });
}