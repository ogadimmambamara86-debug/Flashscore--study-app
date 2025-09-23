import { analyzeMatch, AIAnalysisResult } from './aiAnalysis';

const matchData = {
  homeTeam: "Team A",
  awayTeam: "Team B",
  homeForm: ["W", "L", "W"],
  awayForm: ["L", "L", "D"],
  headToHead: ["W", "L", "W"],
  homeStats: { goalsScored: 2, goalsConceded: 1, cleanSheets: 5, yellowCards: 10, redCards: 1, avgPossession: 55, shotsPerGame: 15 },
  awayStats: { goalsScored: 1, goalsConceded: 2, cleanSheets: 3, yellowCards: 8, redCards: 0, avgPossession: 45, shotsPerGame: 10 },
  odds: { homeWin: 1.5, draw: 3.5, awayWin: 6.0 }
};

// ------------------ Helper ------------------
const mockFetchAI = (mockResponse: Partial<AIAnalysisResult>) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        ...mockResponse,
        timestamp: new Date(),
        analysisId: "analysis-123"
      })
    } as Response)
  );
};

// ------------------ Tests ------------------
describe('analyzeMatch', () => {
  afterEach(() => jest.resetAllMocks());

  // Test multiple prediction scenarios dynamically
  it.each([
    ["home", "Home team is strong"],
    ["draw", "Evenly matched teams"],
    ["away", "Away team favored"]
  ])('returns correct AI analysis for %s prediction', async (prediction, reasoning) => {
    mockFetchAI({ prediction, reasoning, strategy: `Bet on ${prediction}`, confidence: 80, riskLevel: "medium", alternativeBets: ["over 2.5 goals"] });

    const result = await analyzeMatch(matchData);
    const { timestamp, ...rest } = result;

    expect(rest.prediction).toBe(prediction);
    expect(rest.reasoning).toBe(reasoning);
    expect(rest.strategy).toContain(prediction);
    expect(rest.alternativeBets).toContain("over 2.5 goals");
    expect(timestamp).toBeInstanceOf(Date);
  });

  // Test fallback behavior if API fails
  it('returns fallback analysis if AI API fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    const result = await analyzeMatch(matchData);

    expect(result).toHaveProperty('prediction');
    expect(result.strategy).toContain("5(1's) Strategy");
    expect(result.alternativeBets).toContain('Over 2.5 goals');
  });

  // Test invalid match data
  it('throws error for invalid match data', async () => {
    await expect(analyzeMatch({ ...matchData, homeTeam: '' })).rejects.toThrow(
      'Invalid match data: missing team information'
    );
  });
});