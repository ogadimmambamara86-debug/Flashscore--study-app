// apps/backend/src/services/scraperService.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { Match } from "../models/Match";

/**
 * Scrape Stake.com football odds
 * (Stub – update selectors based on real HTML structure)
 */
export const scrapeStakeOdds = async () => {
  const url = "https://stake.com/sports/football"; // Example page
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const oddsData: any[] = [];

  $(".match-card").each((_, el) => {
    const homeTeam = $(el).find(".home-team").text().trim();
    const awayTeam = $(el).find(".away-team").text().trim();
    const oddsHome = $(el).find(".odds-home").text().trim();
    const oddsAway = $(el).find(".odds-away").text().trim();

    oddsData.push({ homeTeam, awayTeam, oddsHome, oddsAway });
  });

  return oddsData;
};

/**
 * Scrape BetToday predictions
 * (Stub – update selectors for real site)
 */
export const scrapeBetTodayPredictions = async () => {
  const url = "https://bettoday.com/predictions"; // Example
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const predictions: any[] = [];

  $(".prediction-card").each((_, el) => {
    const homeTeam = $(el).find(".home-team").text().trim();
    const awayTeam = $(el).find(".away-team").text().trim();
    const prediction = $(el).find(".prediction").text().trim();
    const confidence = $(el).find(".confidence").text().trim();

    predictions.push({ homeTeam, awayTeam, prediction, confidence });
  });

  return predictions;
};

/**
 * Save scraped matches into DB
 */
export const saveScrapedMatches = async () => {
  const odds = await scrapeStakeOdds();
  const predictions = await scrapeBetTodayPredictions();

  // Merge data if needed
  const combined = [...odds, ...predictions];

  for (const match of combined) {
    const exists = await Match.findOne({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
    });

    if (!exists) {
      await Match.create({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date || new Date(),
        competition: match.competition || "Unknown",
        status: "scheduled",
      });
      console.log(`✅ Saved: ${match.homeTeam} vs ${match.awayTeam}`);
    }
  }
};