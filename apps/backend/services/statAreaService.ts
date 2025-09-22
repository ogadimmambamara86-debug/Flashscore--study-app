
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface StatAreaPrediction {
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
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
      }
    }

    // Remove duplicates and return
    return this.removeDuplicates(allPredictions);
  }

  private async fetchPredictionsFromEndpoint(endpoint: string): Promise<StatAreaPrediction[]> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
// Use the same AbortController pattern as Fix 1
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  throw error;
}

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    const html = await response.text();
    return this.parseStatAreaHTML(html, endpoint);
  }

  private parseStatAreaHTML(html: string, source: string): StatAreaPrediction[] {
    const $ = cheerio.load(html);
    const predictions: StatAreaPrediction[] = [];

    // Multiple selectors for different page layouts
    const selectors = [
      '.prediction-row',
      '.match-row',
      '.tip-row',
      'tr.match',
      '.prediction-item'
    ];

    for (const selector of selectors) {
      $(selector).each((index, element) => {
        try {
          const prediction = this.extractPredictionFromElement($, element, source);
          if (prediction) {
            predictions.push(prediction);
          }
        } catch (error) {
          console.warn('Error parsing prediction element:', error);
        }
      });
    }

    return predictions;
  }

  private extractPredictionFromElement($: any, element: any, source: string): StatAreaPrediction | null {
    const $el = $(element);
    
    // Extract teams
    const homeTeam = this.extractTeamName($el, ['.home-team', '.team-home', '.home']);
    const awayTeam = this.extractTeamName($el, ['.away-team', '.team-away', '.away']);
    
    if (!homeTeam || !awayTeam) return null;

    // Extract prediction
    const prediction = this.extractText($el, ['.tip', '.prediction', '.bet-tip', '.recommendation']);
    if (!prediction) return null;

    // Extract other data
    const league = this.extractText($el, ['.league', '.competition', '.tournament']) || 'Unknown';
    const odds = this.extractOdds($el) || 0;
    const confidence = this.calculateConfidence($el, odds);
    const date = this.extractDate($el) || new Date().toISOString();
    const categories = this.extractCategories(prediction, source);

    return {
      matchId: `${this.slugify(homeTeam)}_vs_${this.slugify(awayTeam)}`,
      homeTeam,
      awayTeam,
      prediction,
      confidence,
      league,
      odds,
      date,
      status: 'active',
      categories
    };
  }

  private extractTeamName($el: any, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $el.find(selector).text().trim();
      if (text) return text;
    }
    return '';
  }

  private extractText($el: any, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $el.find(selector).text().trim();
      if (text) return text;
    }
    return '';
  }

  private extractOdds($el: any): number {
    const oddsSelectors = ['.odds', '.odd', '.price', '.coefficient'];
    
    for (const selector of oddsSelectors) {
      const oddsText = $el.find(selector).text().trim();
      const odds = parseFloat(oddsText);
      if (!isNaN(odds) && odds > 1) return odds;
    }
    
    return 0;
  }

  private extractDate($el: any): string {
    const dateSelectors = ['.date', '.time', '.match-date', '.game-time'];
    
    for (const selector of dateSelectors) {
      const dateText = $el.find(selector).text().trim();
      if (dateText) {
        try {
          return new Date(dateText).toISOString();
        } catch {
          continue;
        }
      }
    }
    
    return new Date().toISOString();
  }

  private calculateConfidence($el: any, odds: number): number {
    // Look for explicit confidence
    const confSelectors = ['.confidence', '.probability', '.sure', '.rating'];
    
    for (const selector of confSelectors) {
      const confText = $el.find(selector).text().trim();
      const confMatch = confText.match(/(\d+)%?/);
      if (confMatch) {
        return parseInt(confMatch[1]);
      }
    }

    // Calculate from odds if available
    if (odds > 1) {
      const impliedProb = (1 / odds) * 100;
      return Math.round(Math.min(Math.max(impliedProb, 30), 95));
    }

    // Default confidence
    return 75;
  }

  private extractCategories(prediction: string, source: string): string[] {
    const categories = [source.replace('/predictions/', '').replace('/', '')];
    
    const predLower = prediction.toLowerCase();
    
    if (predLower.includes('over') || predLower.includes('under')) {
      categories.push('over-under');
    }
    if (predLower.includes('both teams') || predLower.includes('btts')) {
      categories.push('both-teams-score');
    }
    if (predLower.includes('win') || predLower.includes('1x2')) {
      categories.push('match-result');
    }
    if (predLower.includes('handicap') || predLower.includes('spread')) {
      categories.push('handicap');
    }

    return categories;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_');
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

  // Get predictions by category
  async getPredictionsByCategory(category: string): Promise<StatAreaPrediction[]> {
    const allPredictions = await this.fetchAllPredictions();
    return allPredictions.filter(pred => 
      pred.categories.includes(category) || 
      pred.prediction.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Get high confidence predictions
  async getHighConfidencePredictions(minConfidence: number = 80): Promise<StatAreaPrediction[]> {
    const allPredictions = await this.fetchAllPredictions();
    return allPredictions
      .filter(pred => pred.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }
}

export const statAreaService = new StatAreaService();
