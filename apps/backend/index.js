
import 'dotenv/config';
import express from "express";
import cors from "cors";

const app = express();

// CORS configuration
const corsConfig = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL || "https://flashscore-study-app.vercel.app"
    : ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "API running on Vercel 🚀" });
});

// Export for Vercel
export default app;
