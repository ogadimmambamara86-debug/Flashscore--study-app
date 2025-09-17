// apps/frontend/controllers/predictionController.ts

import Prediction from "../models/Prediction";
import { connectToDatabase } from "../lib/mongodb";

export default class PredictionController {
  async getAllPredictions() {
    await connectToDatabase();
    return Prediction.find({});
  }

  async getPredictionById(id: string) {
    await connectToDatabase();
    return Prediction.findById(id);
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
    return Prediction.findByIdAndDelete(id);
  }
}