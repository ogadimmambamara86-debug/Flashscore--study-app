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

describe('analyzeMatch retry logic', () => {
  it('should attempt MAX_RETRIES before falling back', async () => {
    const MAX_RETRIES = 3; // Must match AI_CONFIG.MAX_RETRIES
    let fetchCallCount = 0;

    // Mock fetch to always fail
    global.fetch = jest.fn(() => {
      fetchCallCount++;
      return Promise.reject(new Error('Network error'));
    });

    const result = await analyzeMatch(sampleMatchData);

    // Should have tried exactly MAX_RETRIES times
    expect(fetchCallCount).toBe(MAX_RETRIES);
    
    // Should return fallback analysis when all retries fail
    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeDefined();
    expect(result.reasoning).toBeDefined();
  });

  it('should succeed on retry if network recovers', async () => {
    let fetchCallCount = 0;
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              prediction: 'home',
              confidence: 0.75,
              reasoning: 'Test reasoning'
            })
          }
        }]
      })
    };

    // Mock fetch to fail first time, succeed second time
    global.fetch = jest.fn(() => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve(mockResponse as Response);
    });

    const result = await analyzeMatch(sampleMatchData);

    // Should have made 2 attempts (1 failure + 1 success)
    expect(fetchCallCount).toBe(2);
    expect(result.prediction).toBe('home');
    expect(result.confidence).toBe(0.75);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});