// server.ts
import dotenv from "dotenv";
import path from "path";
import express, { Request, Response } from "express";
import cors from "cors";

// Load environment file depending on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, envFile) });

// Import your modules AFTER env is loaded
import { createSportsAPIService } from "./Sports-api";
import { connectDatabase } from "./config/database";
import { NewsController } from "./controllers/newsController";

// CORS setup
let corsConfig: cors.CorsOptions;
if (process.env.NODE_ENV === "production") {
  // Render backend <-> Vercel frontend
  corsConfig = {
    origin: process.env.FRONTEND_URL || "https://flashscore-study-app.vercel.app",
    credentials: true,
  };
} else {
  corsConfig = {
    origin: ["http://localhost:3000"], // dev frontend
    credentials: true,
  };
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors(corsConfig));

// Database
connectDatabase(process.env.MONGODB_URI!);

// Example route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API all set successfully 🚀" });
});

// Controllers / routes
app.use("/api/news", NewsController);
// Example: app.use("/api/sports", createSportsAPIService());

// Error handler (so unhandled errors don’t crash server)
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV}`);
});