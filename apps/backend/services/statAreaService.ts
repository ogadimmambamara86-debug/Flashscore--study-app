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
        console.log(`Fetching predictions from: ${endpoint}`);
        const predictions = await this.fetchPredictionsFromEndpoint(endpoint);
        allPredictions.push(...predictions);
        // Add delay between requests to be respectful
        await this.delay(1000);
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
      }
    }

    // Remove duplicates and return
    return this.removeDuplicates(allPredictions);
  }

  private async fetchPredictionsFromEndpoint(endpoint: string): Promise<StatAreaPrediction[]> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }

      const html = await response.text();
      return this.parseStatAreaHTML(html, endpoint);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
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
      '.prediction-item',
      '.match-prediction',
      '.fixture'
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

    console.log(`Found ${predictions.length} predictions from ${source}`);
    return predictions;
  }

  private extractPredictionFromElement($: cheerio.CheerioAPI, element: cheerio.Element, source: string): StatAreaPrediction | null {
    const $el = $(element);
    
    // Extract teams
    const homeTeam = this.extractTeamName($, $el, ['.home-team', '.team-home', '.home', '.team-a']);
    const awayTeam = this.extractTeamName($, $el, ['.away-team', '.team-away', '.away', '.team-b']);
    
    if (!homeTeam || !awayTeam) {
      console.log('Could not extract team names');
      return null;
    }

    // Extract prediction
    const prediction = this.extractText($, $el, ['.tip', '.prediction', '.bet-tip', '.recommendation', '.pick']);
    if (!prediction) {
      console.log('Could not extract prediction');
      return null;
    }

    // Extract other data
    const league = this.extractText($, $el, ['.league', '.competition', '.tournament']) || 'Unknown';
    const odds = this.extractOdds($, $el) || 0;
    const confidence = this.calculateConfidence($, $el, odds);
    const date = this.extractDate($, $el) || new Date().toISOString();
    const categories = this.extractCategories(prediction, source);

    return {
      matchId: `${this.slugify(homeTeam)}_vs_${this.slugify(awayTeam)}_${Date.now()}`,
      homeTeam,
      awayTeam,
      prediction: prediction.trim(),
      confidence,
      league: league.trim(),
      odds,
      date,
      status: 'active',
      categories
    };
  }

  private extractTeamName($: cheerio.CheerioAPI, $el: cheerio.Cheerio<cheerio.Element>, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $el.find(selector).first().text().trim();
      if (text && text.length > 0) return text;
    }
    
    // Fallback: try to find team names in common structures
    const teamText = $el.text();
    const vsIndex = teamText.toLowerCase().indexOf(' vs ');
    if (vsIndex !== -1) {
      const teams = teamText.split(' vs ');
      if (teams.length === 2) {
        return selectors.includes('.home-team') ? teams[0].trim() : teams[1].trim();
      }
    }
    
    return '';
  }

  private extractText($: cheerio.CheerioAPI, $el: cheerio.Cheerio<cheerio.Element>, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $el.find(selector).first().text().trim();
      if (text && text.length > 0) return text;
    }
    return '';
  }

  private extractOdds($: cheerio.CheerioAPI, $el: cheerio.Cheerio<cheerio.Element>): number {
    const oddsSelectors = ['.odds', '.odd', '.price', '.coefficient', '.value'];
    
    for (const selector of oddsSelectors) {
      const oddsText = $el.find(selector).first().text().trim();
      const oddsMatch = oddsText.match(/(\d+\.\d+|\d+)/);
      if (oddsMatch) {
        const odds = parseFloat(oddsMatch[1]);
        if (!isNaN(odds) && odds >= 1.0) return odds;
      }
    }
    
    return 0;
  }

  private extractDate($: cheerio.CheerioAPI, $el: cheerio.Cheerio<cheerio.Element>): string {
    const dateSelectors = ['.date', '.time', '.match-date', '.game-time', '.datetime'];
    
    for (const selector of dateSelectors) {
      const dateText = $el.find(selector).first().text().trim();
      if (dateText) {
        try {
          // Try to parse the date string
          const parsedDate = new Date(dateText);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
          }
        } catch {
          continue;
        }
      }
    }
    
    return new Date().toISOString();
  }

  private calculateConfidence($: cheerio.CheerioAPI, $el: cheerio.Cheerio<cheerio.Element>, odds: number): number {
    // Look for explicit confidence
    const confSelectors = ['.confidence', '.probability', '.sure', '.rating', '.percent'];
    
    for (const selector of confSelectors) {
      const confText = $el.find(selector).first().text().trim();
      const confMatch = confText.match(/(\d+)%?/);
      if (confMatch) {
        const confidence = parseInt(confMatch[1]);
        if (!isNaN(confidence) && confidence >= 0 && confidence <= 100) {
          return confidence;
        }
      }
    }

    // Calculate from odds if available
    if (odds > 1.0) {
      const impliedProb = (1 / odds) * 100;
      return Math.round(Math.min(Math.max(impliedProb, 30), 95));
    }

    // Default confidence
    return 75;
  }

  private extractCategories(prediction: string, source: string): string[] {
    const categories: string[] = [];
    
    // Add source-based categories
    if (source.includes('over-under')) categories.push('over-under');
    if (source.includes('both-teams')) categories.push('both-teams-score');
    if (source.includes('1x2')) categories.push('match-result');
    
    // Add prediction-based categories
    const predLower = prediction.toLowerCase();
    
    if (predLower.includes('over') || predLower.includes('under')) {
      categories.push('over-under');
    }
    if (predLower.includes('both teams') || predLower.includes('btts')) {
      categories.push('both-teams-score');
    }
    if (predLower.includes('win') || predLower.includes('1x2') || predLower.includes('draw')) {
      categories.push('match-result');
    }
    if (predLower.includes('handicap') || predLower.includes('spread')) {
      categories.push('handicap');
    }

    // Remove duplicates
    return [...new Set(categories)];
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
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

  // Get predictions by category
  async getPredictionsByCategory(category: string): Promise<StatAreaPrediction[]> {
    const allPredictions = await this.fetchAllPredictions();
    return allPredictions.filter(pred => 
      pred.categories.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      ) || 
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

  // Get predictions for a specific league
  async getPredictionsByLeague(league: string): Promise<StatAreaPrediction[]> {
    const allPredictions = await this.fetchAllPredictions();
    return allPredictions.filter(pred => 
      pred.league.toLowerCase().includes(league.toLowerCase())
    );
  }
}

export const statAreaService = new StatAreaService();