// server.ts
import dotenv from "dotenv";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDatabase, disconnectDatabase } from "./config/database";

// Load environment file depending on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, envFile) });

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- Middleware -----------------
let corsConfig: cors.CorsOptions;
if (process.env.NODE_ENV === "production") {
  corsConfig = {
    origin: process.env.FRONTEND_URL || "https://flashscore-study-app.vercel.app",
    credentials: true,
  };
} else {
  corsConfig = {
    origin: ["http://localhost:3000"],
    credentials: true,
  };
}

app.use(cors(corsConfig));
app.use(express.json());

// ----------------- Routes -----------------
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime(), env: process.env.NODE_ENV });
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API all set champion 🏆 🚀" });
});

// Example import usage
// import { NewsController } from "./controllers/newsController";
// app.use("/api/news", NewsController);

// ----------------- Error Handler -----------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ----------------- Start Server -----------------
const server = app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV}`);
});

// ----------------- Graceful Shutdown -----------------
const shutdown = async (signal: string) => {
  console.log(`🛑 Received ${signal}. Shutting down...`);
  server.close(async () => {
    await disconnectDatabase();
    console.log("🏆 Shutdown complete. Goodbye!");
    process.exit(0);
  });
};

["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, () => shutdown(signal)));

// Catch uncaught exceptions & rejections
process.on("uncaughtException", (err) => {
  console.error(`💥 Uncaught Exception:`, err);
  process.exit(1); // safest option in prod
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`💥 Unhandled Rejection:`, reason);
});