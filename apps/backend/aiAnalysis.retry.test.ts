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

    // Should have tried exactly MAX_RE