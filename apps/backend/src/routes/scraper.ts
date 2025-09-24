// apps/backend/src/routes/scraper.ts
import { FastifyInstance } from "fastify";
import {
  scrapeStakeOdds,
  scrapeBetTodayPredictions,
  saveScrapedMatches,
} from "../services/scraperService";

export async function scraperRoutes(server: FastifyInstance) {
  server.get("/scrape/odds", async () => {
    return await scrapeStakeOdds();
  });

  server.get("/scrape/predictions", async () => {
    return await scrapeBetTodayPredictions();
  });

  server.get("/scrape/save", async () => {
    await saveScrapedMatches();
    return { message: "Scraping completed and saved to DB." };
  });
}