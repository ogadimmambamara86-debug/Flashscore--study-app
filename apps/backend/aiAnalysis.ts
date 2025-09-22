// aiAnalysis.ts
export interface AIAnalysisResult {
  // your existing interface properties
}

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeForm: string[];
  awayForm: string[];
  headToHead: string[];
  homeStats: {
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
  };
  awayStats: {
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
  };
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

interface AIAnalysisResult {
  prediction: "home" | "draw" | "away";
  confidence: number;
  reasoning: string;
  strategy: string;
  riskLevel: "low" | "medium" | "high";
  alternativeBets?: string[];
}

// Configuration for AI analysis
const AI_CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_AI_API_ENDPOINT || "/api/ai-analysis",
  FALLBACK_ENABLED: true,
  TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
};

/**
 * Apply the 5(1's) strategy logic
 */
const applyFiveOnesStrategy = (
  matchData: MatchData,
): { confidence: number; reasoning: string } => {
  let confidence = 50; // Base confidence
  let reasoning = [];

  // Analyze recent form (last 5 games)
  const homeWins = matchData.homeForm.filter((result) => result === "W").length;
  const awayWins = matchData.awayForm.filter((result) => result === "W").length;

  if (homeWins >= 3) {
    confidence += 15;
    reasoning.push("Home team has strong recent form");
  }

  if (awayWins >= 3) {
    confidence -= 15;
    reasoning.push("Away team has strong recent form");
  }

  // Analyze goal statistics
  const homeGoalDiff =
    matchData.homeStats.goalsScored - matchData.homeStats.goalsConceded;
  const awayGoalDiff =
    matchData.awayStats.goalsScored - matchData.awayStats.goalsConceded;

  if (homeGoalDiff > awayGoalDiff) {
    confidence += 10;
    reasoning.push("Home team has better goal difference");
  } else if (awayGoalDiff > homeGoalDiff) {
    confidence -= 10;
    reasoning.push("Away team has better goal difference");
  }

  // Head-to-head analysis
  const recentH2H = matchData.headToHead.slice(0, 3);
  const homeH2HWins = recentH2H.filter((result) => result === "H").length;

  if (homeH2HWins >= 2) {
    confidence += 8;
    reasoning.push("Home team dominates recent head-to-head");
  }

  return {
    confidence: Math.max(20, Math.min(80, confidence)), // Clamp between 20-80
    reasoning: reasoning.join(". "),
  };
};

/**
 * Analyze match using fallback logic when AI API is unavailable
 */
const fallbackAnalysis = (matchData: MatchData): AIAnalysisResult => {
  const strategy = applyFiveOnesStrategy(matchData);

  let prediction: "home" | "draw" | "away" = "home";
  let riskLevel: "low" | "medium" | "high" = "medium";

  if (strategy.confidence > 65) {
    prediction = "home";
    riskLevel = "low";
  } else if (strategy.confidence < 45) {
    prediction = "away";
    riskLevel = "medium";
  } else {
    prediction = "draw";
    riskLevel = "high";
  }

  return {
    prediction,
    confidence: strategy.confidence,
    reasoning: strategy.reasoning || "Analysis based on statistical comparison",
    strategy:
      "5(1's) Strategy - Conservative approach based on recent form and statistics",
    riskLevel,
    alternativeBets: ["Both teams to score", "Over 2.5 goals", "Double chance"],
  };
};

/**
 * Call external AI API for analysis
 */
const callAIAPI = async (matchData: MatchData): Promise<AIAnalysisResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(AI_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const result = await response.json();
    return result as AIAnalysisResult;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      console.error("AI API call failed:", error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    } else {
      console.error("Unknown AI API error:", String(error));
      throw new Error("AI analysis failed with unknown error");
    }
  }
};

/**
 * Main analysis function with retry logic
 */
export const analyzeMatch = async (
  matchData: MatchData,
): Promise<AIAnalysisResult> => {
  let lastError: Error | null = null;

  // Validate input data
  if (!matchData.homeTeam || !matchData.awayTeam) {
    throw new Error("Invalid match data: missing team information");
  }

  // Try AI API with retries
  for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`AI Analysis attempt ${attempt}/${AI_CONFIG.MAX_RETRIES}`);
      const result = await callAIAPI(matchData);
      return result; // Success, return AI API result
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed: ${error.message}`);
      } else {
        console.warn(`Attempt ${attempt} failed with unknown error:`, error);
      }
    }
  }

  // If AI API fails after retries, use fallback
  if (AI_CONFIG.FALLBACK_ENABLED) {
    console.log("Falling back to local analysis strategy");
    return fallbackAnalysis(matchData);
  }

  throw lastError || new Error("AI analysis failed after retries");
};
