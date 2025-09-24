
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  piCoins: number;
  level: number;
  predictions: Schema.Types.ObjectId[];
  createdAt: Date;
  lastActive: Date;
  preferences: {
    favoriteLeagues: string[];
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    piCoins: { type: Number, default: 100 },
    level: { type: Number, default: 1 },
    predictions: [{ type: Schema.Types.ObjectId, ref: "Prediction" }],
    lastActive: { type: Date, default: Date.now },
    preferences: {
      favoriteLeagues: [{ type: String }],
      notifications: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
