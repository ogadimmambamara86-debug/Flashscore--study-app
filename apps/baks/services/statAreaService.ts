// services/statAreaService.ts
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export interface StatAreaPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  league: string;
  odds: number;
  date: string;
  status: 'active' | 'completed' | 'upcoming';
  categories: string[];
}

export class StatAreaService {
  private baseUrl = 'https://www.statarea.com';
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async fetchAllPredictions(): Promise<StatAreaPrediction[]> {
    const endpoints = [
      '/predictions/today',
      '/predictions/tomorrow',
      '/soccer-predictions',
      '/football-predictions',
      '/predictions/1x2',
      '/predictions/over-under',
      '/predictions/both-teams-to-score'
    ];

    const allPredictions: StatAreaPrediction[] = [];

    for (const endpoint of endpoints) {
      try {
        const predictions = await this.fetchPredictionsFromEndpoint(endpoint);
        allPredictions.push(...predictions);
        await this.delay(1000);
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
      }
    }

    return this.removeDuplicates(allPredictions);
  }

  private async fetchPredictionsFromEndpoint(endpoint: string): Promise<StatAreaPrediction[]> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

      const html = await response.text();
      return this.parseStatAreaHTML(html);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private parseStatAreaHTML(html: string): StatAreaPrediction[] {
    const $ = cheerio.load(html);
    const predictions: StatAreaPrediction[] = [];
    $('.prediction-row, .match-row, .tip-row').each((i, el) => {
      const $el = $(el);
      const homeTeam = $el.find('.home-team, .team-home').text().trim();
      const awayTeam = $el.find('.away-team, .team-away').text().trim();
      const predictionText = $el.find('.tip, .prediction').text().trim();
      if (!homeTeam || !awayTeam || !predictionText) return;
      predictions.push({
        matchId: `${homeTeam}_vs_${awayTeam}_${Date.now()}`,
        homeTeam,
        awayTeam,
        prediction: predictionText,
        confidence: 75,
        league: 'Unknown',
        odds: 0,
        date: new Date().toISOString(),
        status: 'active',
        categories: []
      });
    });
    return predictions;
  }

  private removeDuplicates(predictions: StatAreaPrediction[]): StatAreaPrediction[] {
    const seen = new Set();
    return predictions.filter(pred => {
      const key = `${pred.matchId}_${pred.prediction}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const statAreaService = new StatAreaService();