// apps/backend/src/main.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";

import { healthRoutes } from "./routes/health";
import { matchRoutes } from "./routes/matches";
import { predictionRoutes } from "./routes/predictions";
import { scraperRoutes } from "./routes/scraper"; // <-- move import here

const server = Fastify();

// Configure CORS properly for Replit environment
const allowedOrigins = [
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  'http://localhost:5000',
  'http://0.0.0.0:5000'
].filter(Boolean);

server.register(cors, { 
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
  credentials: true 
});

// Register routes
server.register(healthRoutes);
server.register(matchRoutes);
server.register(predictionRoutes);
server.register(scraperRoutes); // <-- register scraper API

const start = async () => {
  await connectDB();
  server.listen({ 
    port: Number(process.env.PORT) || 4000,
    host: 'localhost'  // Backend should use localhost, not 0.0.0.0
  }, (err, address) => {
    if (err) throw err;
    console.log(`🚀 Server running at ${address}`);
  });
};

start();