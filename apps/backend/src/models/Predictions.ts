import { Schema, model, Document } from "mongoose";

export interface IPrediction extends Document {
  matchId: string;
  predictedOutcome: "home" | "draw" | "away";
  confidence: number; // 0 - 1
  createdAt: Date;
}

const PredictionSchema = new Schema<IPrediction>({
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  predictedOutcome: { type: String, enum: ["home", "draw", "away"], required: true },
  confidence: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PredictionModel = model<IPrediction>("Prediction", PredictionSchema);