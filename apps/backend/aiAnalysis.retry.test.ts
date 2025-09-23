// aiAnalysis.retry.test.ts
import { analyzeMatch } from './aiAnalysis';

// Define this once to avoid repetition
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

// Mock response factory to avoid duplication
const createMockResponse = (prediction: string, confidence: number, reasoning: string) => ({
  ok: true,
  json: () => Promise.resolve({
    choices: [{
      message: {
        content: JSON.stringify({ prediction, confidence, reasoning })
      }
    }]
  })
});

describe('analyzeMatch retry logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
      reasoning: expect.any(String)
    });
    // Verify fallback values are reasonable
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
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
      reasoning: 'Test reasoning'
    });
  });

  // Add this test to cover successful first attempt
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

  // Add this test for HTTP errors (non-network errors)
  it('should handle HTTP errors appropriately', async () => {
    let fetchCallCount = 0;

    global.fetch = jest.fn(() => {
      fetchCallCount++;
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);
    });

    const result = await analyzeMatch(sampleMatchData);

    // Should not retry on HTTP errors (or should it? Adjust based on your implementation)
    expect(fetchCallCount).toBe(1);
    expect(result).toBeDefined(); // Should still return fallback
  });
});