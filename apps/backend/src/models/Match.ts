// apps/backend/src/models/Match.ts
import { Schema, model, Document } from "mongoose";

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  competition: string;
  score?: string;
  status: "scheduled" | "live" | "completed";
}

const matchSchema = new Schema<IMatch>(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    competition: { type: String, required: true },
    score: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export const Match = model<IMatch>("Match", matchSchema);