// apps/backend/src/main.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";

import { healthRoutes } from "./routes/health";
import { matchRoutes } from "./routes/matches";
import { predictionRoutes } from "./routes/predictions";
import { scraperRoutes } from "./routes/scraper"; // <-- move import here

const server = Fastify();
server.register(cors, { origin: "*" });

// Register routes
server.register(healthRoutes);
server.register(matchRoutes);
server.register(predictionRoutes);
server.register(scraperRoutes); // <-- register scraper API

const start = async () => {
  await connectDB();
  server.listen({ port: Number(process.env.PORT) || 4000 }, (err, address) => {
    if (err) throw err;
    console.log(`🚀 Server running at ${address}`);
  });
};

start();