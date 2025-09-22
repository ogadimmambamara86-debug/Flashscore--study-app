// aiAnalysis.all.test.ts
import { analyzeMatch, AIAnalysisResult } from './aiAnalysis';

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

describe('analyzeMatch full test suite (TypeScript)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns mocked AI API response when API succeeds', async () => {
    const mockAIResult: AIAnalysisResult = {
      prediction: 'home',
      confidence: 75,
      reasoning: 'Mocked AI reasoning',
      strategy: 'AI prediction strategy',
      riskLevel: 'low',
      alternativeBets: ['Both teams to score'],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAIResult),
      } as any)
    );

    const result = await analyzeMatch(sampleMatchData);

    expect(result).toEqual(mockAIResult);
  });

  it('returns fallback analysis if AI API fails', async () => {
    process.env.NEXT_PUBLIC_AI_API_ENDPOINT = 'http://invalid-endpoint';
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    const result = await analyzeMatch(sampleMatchData);

    expect(result).toHaveProperty('prediction');
    expect(result.strategy).toContain("5(1's) Strategy");
    expect(result.alternativeBets).toContain('Over 2.5 goals');
  });

  it('throws error for invalid match data', async () => {
    await expect(analyzeMatch({ ...sampleMatchData, homeTeam: '' })).rejects.toThrow(
      'Invalid match data: missing team information'
    );
  });

  it('should attempt MAX_RETRIES before falling back', async () => {
    const MAX_RETRIES = 3; // Must match AI_CONFIG.MAX_RETRIES
    let fetchCallCount = 0;

    global.fetch = jest.fn(() => {
      fetchCallCount++;
      return Promise.reject(new Error('Network error'));
    });

    const result = await analyzeMatch(sampleMatchData);

    expect(fetchCallCount).toBe(MAX_RETRIES);
    expect(result.strategy).toContain("5(1's) Strategy");
  });
});