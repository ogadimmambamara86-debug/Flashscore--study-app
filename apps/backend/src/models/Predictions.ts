
import { Schema, model, Document } from "mongoose";

export interface IPrediction extends Document {
  matchId: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId;
  predictedOutcome: "home" | "draw" | "away";
  confidence: number; // 0-100
  aiScore: number; // AI model confidence score
  modelVersion: string;
  predictionType: 'ai' | 'user' | 'expert';
  metadata: {
    odds?: number;
    expectedValue?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    features?: Record<string, any>;
  };
  result?: 'correct' | 'incorrect' | 'pending';
  actualOutcome?: "home" | "draw" | "away";
  piCoinsWagered?: number;
  piCoinsWon?: number;
}

const predictionSchema = new Schema<IPrediction>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    predictedOutcome: { 
      type: String, 
      enum: ["home", "draw", "away"], 
      required: true 
    },
    confidence: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
    aiScore: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
    modelVersion: { type: String, required: true, default: "v1.0" },
    predictionType: { 
      type: String, 
      enum: ['ai', 'user', 'expert'], 
      default: 'ai' 
    },
    metadata: {
      odds: { type: Number },
      expectedValue: { type: Number },
      riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
      features: { type: Schema.Types.Mixed }
    },
    result: { 
      type: String, 
      enum: ['correct', 'incorrect', 'pending'], 
      default: 'pending' 
    },
    actualOutcome: { type: String, enum: ["home", "draw", "away"] },
    piCoinsWagered: { type: Number, default: 0 },
    piCoinsWon: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for performance
predictionSchema.index({ matchId: 1 });
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ result: 1 });

export const PredictionModel = model<IPrediction>("Prediction", predictionSchema);
