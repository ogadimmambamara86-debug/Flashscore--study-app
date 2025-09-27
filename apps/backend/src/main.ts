// apps/backend/src/main.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";

import { healthRoutes } from "./routes/health";
import { matchRoutes } from "./routes/matches";
import { predictionRoutes } from "./routes/predictions";
import { scraperRoutes } from "./routes/scraper"; // <-- move import here
import { mlRoutes } from "./routes/ml";
import { newsAuthorRoutes } from "./routes/newsAuthors";
import { newsRoutes } from "./routes/news";

const server = Fastify();

// Configure CORS properly for production
const allowedOrigins = [
  'https://flashscore-study-app.vercel.app',
  'https://302a3520-1a25-488e-b2d3-26ceed56ba96-00-4e1xep2o5f5l.kirk.replit.dev',
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined,
  'http://localhost:5000',
  'http://0.0.0.0:5000',
  'http://localhost:3000',
  'http://0.0.0.0:3000'
].filter((origin): origin is string => typeof origin === 'string');

server.register(cors, { 
  origin: true,
  credentials: true 
});

// Register routes
server.register(healthRoutes, { prefix: "/api" });
server.register(matchRoutes, { prefix: "/api" });
server.register(predictionRoutes, { prefix: "/api" });
server.register(scraperRoutes, { prefix: "/api" }); // <-- register scraper API
server.register(mlRoutes, { prefix: "/api/ml" });
server.register(newsAuthorRoutes, { prefix: "/api" });
server.register(newsRoutes, { prefix: "/api" });

const start = async () => {
  await connectDB();
  server.listen({ 
    port: Number(process.env.PORT) || 8000,
    host: '0.0.0.0'  // Use 0.0.0.0 for accessibility
  }, (err, address) => {
    if (err) throw err;
    console.log(`🚀 Server running at ${address}`);
  });
};

start();