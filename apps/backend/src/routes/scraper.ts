// apps/backend/src/routes/scraper.ts
import { FastifyInstance } from "fastify";
import { saveScrapedMatches } from "../services/scraperService";

export async function scraperRoutes(server: FastifyInstance) {
  server.get("/scrape", async () => {
    await saveScrapedMatches();
    return { message: "Scraping completed and saved to DB." };
  });
}