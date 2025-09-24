import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

// Load environment variables
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, envFile) });

console.log(`🛠 Loading environment from ${envFile}`);
console.log("🔎 NODE_ENV:", process.env.NODE_ENV);

// ----------------- App Setup -----------------
const app = express();
const PORT = process.env.PORT || 4000;

// ----------------- CORS Setup -----------------
const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL || "https://flashscore-study-app.vercel.app"]
    : ["http://0.0.0.0:3000", "http://localhost:3000", "http://0.0.0.0:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ----------------- API Routes -----------------
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "MagajiCo Backend API",
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/predictions", (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [
      { match: "Team A vs Team B", prediction: "Team A Win", confidence: 85 },
      { match: "Team C vs Team D", prediction: "Draw", confidence: 72 }
    ]
  });
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🏆 MagajiCo Backend API - FastAPI Style with Express",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/predictions"]
  });
});

// ----------------- Error Handler -----------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ----------------- Start Server -----------------
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend API running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Health check: http://0.0.0.0:${PORT}/api/health`);
});

// ----------------- Graceful Shutdown -----------------
const shutdown = (signal: string) => {
  console.log(`🛑 Received ${signal}. Shutting down...`);
  server.close(() => {
    console.log("🏆 Backend shutdown complete");
    process.exit(0);
  });
};

["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => shutdown(signal))
);