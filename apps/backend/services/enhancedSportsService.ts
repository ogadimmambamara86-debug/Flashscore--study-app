interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class EnhancedSportsService {
  private config: any;

  // Caches with TTL
  private statsCache: Map<string, CacheEntry<any>> = new Map();
  private eventsCache: Map<string, CacheEntry<any>> = new Map();
  private newsCache: Map<string, CacheEntry<any>> = new Map();
  private socialCache: Map<string, CacheEntry<any>> = new Map();

  private CACHE_TTL_MS = 30 * 1000; // 30 seconds

  constructor(config: any) {
    this.config = config;
  }

  // --- Helper: fetch with timeout ---
  private async fetchWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
    let timeout: NodeJS.Timeout;
    const timer = new Promise<null>((resolve) => {
      timeout = setTimeout(() => resolve(null), timeoutMs);
    });
    const result = await Promise.race([promise, timer]);
    clearTimeout(timeout!);
    return result as T | null;
  }

  // --- Cached getter with TTL ---
  private async getCached<T>(
    cache: Map<string, CacheEntry<T>>,
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
      return cached.value;
    }
    const value = await fetcher();
    cache.set(key, { value, expiry: now + this.CACHE_TTL_MS });
    return value;
  }

  // --- Main method ---
  async fetchLiveMatchesWithStats(): Promise<EnhancedMatch[]> {
    try {
      const [basicMatchesResult, detailedStatsResult, socialDataResult] = await Promise.allSettled([
        this.fetchWithTimeout(this.fetchBasicMatches(), 5000),
        this.fetchWithTimeout(this.fetchDetailedStats(), 5000),
        this.fetchWithTimeout(this.fetchSocialData(), 5000)
      ]);

      if (basicMatchesResult.status !== 'fulfilled' || !basicMatchesResult.value) {
        return this.getFallbackMatches();
      }

      const detailedStats = detailedStatsResult.status === 'fulfilled' && detailedStatsResult.value
        ? detailedStatsResult.value
        : {};
      const socialData = socialDataResult.status === 'fulfilled' && socialDataResult.value
        ? socialDataResult.value
        : {};

      const matches = await Promise.all(
        basicMatchesResult.value.map(async (match: any) => {
          const [statistics, events, social, news] = await Promise.all([
            this.getCached(this.statsCache, match.id, () => this.getMatchStats(match.id, detailedStats)),
            this.getCached(this.eventsCache, match.id, () => this.fetchMatchEvents(match.id)),
            this.getCached(this.socialCache, match.id, () => this.getSocialDataAsync(match.id, socialData)),
            this.getCached(this.newsCache, match.id, () => this.fetchMatchNews(match.id))
          ]);

          return {
            ...match,
            statistics,
            events,
            socialData: social,
            news
          } as EnhancedMatch;
        })
      );

      return matches;
    } catch (error) {
      console.error('Error fetching enhanced matches:', error);
      return this.getFallbackMatches();
    }
  }

  // --- Placeholders ---
  async fetchBasicMatches(): Promise<any[]> { return []; }
  async fetchDetailedStats(): Promise<any> { return {}; }
  async fetchMatchEvents(matchId: string): Promise<any> { return {}; }
  async fetchMatchNews(matchId: string): Promise<any> { return {}; }
  async getMatchStats(matchId: string, detailedStats: any): Promise<any> { return detailedStats[matchId] || {}; }
  async getSocialDataAsync(matchId: string, socialData: any): Promise<any> { return socialData[matchId] || {}; }
  async fetchSocialData(): Promise<any> { return {}; }
  async getFallbackMatches(): Promise<EnhancedMatch[]> { return []; }
}