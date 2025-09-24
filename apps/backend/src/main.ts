import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";
import { healthRoutes } from "./routes/health";
import { matchRoutes } from "./routes/matches";
import { predictionRoutes } from "./routes/predictions"; // <-- new

const server = Fastify();
server.register(cors, { origin: "*" });

// Register routes
server.register(healthRoutes);
server.register(matchRoutes);
server.register(predictionRoutes); // <-- register predictions API

const start = async () => {
  await connectDB();
  server.listen({ port: Number(process.env.PORT) || 4000 }, (err, address) => {
    if (err) throw err;
    console.log(`🚀 Server running at ${address}`);
  });
};

start();