// apps/frontend/app/api/predictions/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { fetchPredictions } from "./../../services/predictionsService";
import PredictionController from "../../../controllers/predictionController";

const predictionController = new PredictionController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Get external predictions (scraped)
      const externalPredictions = await fetchPredictions();

      // Get internal predictions (MongoDB)
      const internalPredictions = await predictionController.getAllPredictions();

      // Merge both
      const allPredictions = [
        ...internalPredictions.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          content: p.content,
          source: "internal",
          sport: p.sport,
          confidence: `${p.confidence}%`,
          status: p.status,
          match: p.matchDetails ? `${p.matchDetails.home} vs ${p.matchDetails.away}` : "TBD",
        })),
        ...externalPredictions.map((p: any, index: number) => ({
          id: `ext_${index}`,
          title: p.title,
          content: p.content || "External prediction analysis",
          source: "external",
          sport: p.sport || "Football",
          confidence: p.confidence || "70%",
          status: "active",
          match: "External Match",
        })),
      ];

      res.status(200).json(allPredictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  } else if (req.method === "POST") {
    try {
      const newPrediction = await predictionController.createPrediction(req.body);
      res.status(201).json(newPrediction);
    } catch (error: any) {
      console.error("Error creating prediction:", error);
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, ...data } = req.body;
      const updatedPrediction = await predictionController.updatePrediction(id, data);
      res.status(200).json(updatedPrediction);
    } catch (error: any) {
      console.error("Error updating prediction:", error);
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await predictionController.deletePrediction(id as string);
      res.status(204).end();
    } catch (error: any) {
      console.error("Error deleting prediction:", error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}