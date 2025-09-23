// aiAnalysis.retry.test.ts
import { analyzeMatch } from './aiAnalysis';

const sampleMatchData = {
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  homeForm: ['W', 'D', 'L', 'W', 'W'],
  awayForm: ['L', 'L', 'D', 'W', 'L'],
  headToHead: ['H', 'A', 'H', 'D', 'H'],
  homeStats: { goalsScored: 10, goalsConceded: 5, cleanSheets: 3, yellowCards: 5, redCards: 0 },
  awayStats: { goalsScored: 7, goalsConceded: 8, cleanSheets: 2, yellowCards: 6, redCards: 1 },
  odds: { home: 1.8, draw: 3.2, away: 4.5 },
};

const createMockResponse = (prediction: string, confidence: number, reasoning: string) => ({
  ok: true,
  json: () =>
    Promise.resolve({
      choices: [
        {
          message: {
            content: JSON.stringify({ prediction, confidence, reasoning }),
          },
        },
      ],
    }),
});

describe('analyzeMatch retry logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Network failures and retries', () => {
    it('should attempt MAX_RETRIES before falling back', async () => {
      const MAX_RETRIES = 3;
      let fetchCallCount = 0;

      global.fetch = jest.fn(() => {
        fetchCallCount++;
        return Promise.reject(new Error('Network error'));
      });

      const result = await analyzeMatch(sampleMatchData);

      expect(fetchCallCount).toBe(MAX_RETRIES);
      expect(result).toEqual({
        prediction: expect.any(String),
        confidence: expect.any(Number),
        reasoning: expect.any(String),
      });
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should succeed on retry if network recovers', async () => {
      let fetchCallCount = 0;

      global.fetch = jest.fn(() => {
        fetchCallCount++;
        if (fetchCallCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(createMockResponse('home', 0.75, 'Test reasoning') as Response);
      });

      const result = await analyzeMatch(sampleMatchData);

      expect(fetchCallCount).toBe(2);
      expect(result).toEqual({
        prediction: 'home',
        confidence: 0.75,
        reasoning: 'Test reasoning',
      });
    });
  });

  describe('Successful API responses', () => {
    it('should succeed on first attempt without retries', async () => {
      let fetchCallCount = 0;

      global.fetch = jest.fn(() => {
        fetchCallCount++;
        return Promise.resolve(createMockResponse('away', 0.6, 'First attempt success') as Response);
      });

      const result = await analyzeMatch(sampleMatchData);

      expect(fetchCallCount).toBe(1);
      expect(result.prediction).toBe('away');
      expect(result.confidence).toBe(0.6);
    });
  });

  describe('HTTP errors', () => {
    it('should handle HTTP errors appropriately', async () => {
      let fetchCallCount = 0;

      global.fetch = jest.fn(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response);
      });

      const result = await analyzeMatch(sampleMatchData);

      expect(fetchCallCount).toBe(1); // usually no retry on HTTP errors
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Malformed API responses', () => {
    it('should handle invalid JSON from API gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        } as Response)
      );

      const result = await analyzeMatch(sampleMatchData);

      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Retry delays', () => {
    it('should respect retry delay between attempts', async () => {
      jest.useFakeTimers();
      const retryDelay = 1000;
      const MAX_RETRIES = 3;
      let fetchCallCount = 0;

      global.fetch = jest.fn(() => {
        fetchCallCount++;
        return Promise.reject(new Error('Network error'));
      });

      const analysisPromise = analyzeMatch(sampleMatchData);

      for (let i = 1; i <= MAX_RETRIES; i++) {
        expect(fetchCallCount).toBe(i);
        jest.advanceTimersByTime(retryDelay);
        await Promise.resolve();
      }

      const result = await analysisPromise;

      expect(fetchCallCount).toBe(MAX_RETRIES);
      expect(result).toEqual({
        prediction: expect.any(String),
        confidence: expect.any(Number),
        reasoning: expect.any(String),
      });

      jest.useRealTimers();
    });
  });
});