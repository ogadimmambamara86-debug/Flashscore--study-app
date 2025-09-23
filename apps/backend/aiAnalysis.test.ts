// aiAnalysis.test.ts
import { analyzeMatch, AIAnalysisResult } from './aiAnalysis';

// aiAnalysis.test.ts and other test files
const matchData: MatchData = {
  homeTeam: "Team A",
  awayTeam: "Team B",
  homeForm: ["W", "L", "W"],
  awayForm: ["L", "L", "D"],
  headToHead: ["W", "L", "W"],
  homeStats: {
    goalsScored: 2,
    goalsConceded: 1,
    cleanSheets: 5,
    yellowCards: 10,
    redCards: 1,
    avgPossession: 55, // Add this
    shotsPerGame: 15   // Add this
  },
  awayStats: {
    goalsScored: 1,
    goalsConceded: 2,
    cleanSheets: 3,
    yellowCards: 8,
    redCards: 0,
    avgPossession: 45, // Add this
    shotsPerGame: 10   // Add this
  },
  odds: {
    homeWin: 1.5,
    draw: 3.5,
    awayWin: 6.0
  }
};

const mockAnalysis: AIAnalysisResult = {
  prediction: "home",
  confidence: 85,
  reasoning: "Home team is strong",
  strategy: "Bet on home win",
  riskLevel: "low",
  alternativeBets: ["over 2.5 goals", "both teams to score"],
  keyFactors: ["Home advantage", "Recent form"], // Add this
  timestamp: new Date(), // Add this
  analysisId: "analysis-123" // Add this
};
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
});