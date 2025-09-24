import { FastifyInstance } from "fastify";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/api/health", async (request, reply) => {
    return { status: "ok", timestamp: Date.now() };
  });
}