import { Schema, model, Document } from "mongoose";

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  competition: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  result?: "home" | "draw" | "away";
}

const MatchSchema = new Schema<IMatch>({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  date: { type: Date, required: true },
  competition: { type: String, required: true },
  odds: {
    home: { type: Number, required: true },
    draw: { type: Number, required: true },
    away: { type: Number, required: true },
  },
  result: { type: String, enum: ["home", "draw", "away"], default: null },
});

export const MatchModel = model<IMatch>("Match", MatchSchema);