// apps/frontend/controllers/predictionController.ts

import Prediction from "../models/Prediction";
import Author from "../models/Author";
import { connectToDatabase } from "../lib/mongodb";

export default class PredictionController {
  async getAllPredictions() {
    await connectToDatabase();
    return Prediction.find({ isActive: true, status: "active" });
  }

  async getPredictionById(id: string) {
    await connectToDatabase();
    return Prediction.findById(id);
  }

  async getPredictionsByAuthor(authorId: string) {
    await connectToDatabase();
    return Prediction.find({ authorId, isActive: true });
  }

  async getPredictionsBySport(sport: string) {
    await connectToDatabase();
    return Prediction.find({
      sport: { $regex: new RegExp(`^${sport}$`, "i") },
      isActive: true,
      status: "active",
    });
  }

  async createPrediction(data: any) {
    await connectToDatabase();
    return Prediction.create(data);
  }

  async updatePrediction(id: string, data: any) {
    await connectToDatabase();
    return Prediction.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePrediction(id: string) {
    await connectToDatabase();
    return Prediction.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async getStatistics() {
    await connectToDatabase();
    const total = await Prediction.countDocuments({ isActive: true });
    const active = await Prediction.countDocuments({ isActive: true, status: "active" });
    const completed = await Prediction.countDocuments({ isActive: true, status: "completed" });
    const wins = await Prediction.countDocuments({ isActive: true, status: "completed", result: "win" });
    const winRate = completed > 0 ? ((wins / completed) * 100).toFixed(1) : "0";

    return { total, active, completed, winRate: `${winRate}%` };
  }

  async getAllAuthors() {
    await connectToDatabase();
    return Author.find({ isActive: true });
  }

  async getAuthorById(id: string) {
    await connectToDatabase();
    return Author.findById(id);
  }
}