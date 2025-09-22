// aiAnalysis.ts

export interface MatchData {
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
    avgPossession: number;
    shotsPerGame: number;
  };
  awayStats: {
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    avgPossession: number;
    shotsPerGame: number;
  };
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
  venue?: 'home' | 'neutral';
  importance?: 'low' | 'medium' | 'high';
}

export interface AIAnalysisResult {
  prediction: "home" | "draw" | "away";
  confidence: number;
  reasoning: string;
  strategy: string;
  riskLevel: "low" | "medium" | "high";
  expectedScore?: string;
  keyFactors: string[];
  alternativeBets?: string[];
  timestamp: Date;
  analysisId: string;
}

export interface AnalysisCache {
  [key: string]: {
    result: AIAnalysisResult;
    timestamp: number;
    expiresAt: number;
  };
}

// Configuration for AI analysis
const AI_CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_AI_API_ENDPOINT || "/api/ai-analysis",
  FALLBACK_ENABLED: true,
  TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  MIN_CONFIDENCE_THRESHOLD: 60,
};

// In-memory cache for analysis results
const analysisCache: AnalysisCache = {};

/**
 * Generate cache key from match data
 */
const generateCacheKey = (matchData: MatchData): string => {
  const keyData = {
    home: matchData.homeTeam,
    away: matchData.awayTeam,
    homeForm: matchData.homeForm.join(','),
    awayForm: matchData.awayForm.join(','),
    h2h: matchData.headToHead.join(','),
  };
  return btoa(JSON.stringify(keyData));
};

/**
 * Get cached analysis if available and valid
 */
const getCachedAnalysis = (cacheKey: string): AIAnalysisResult | null => {
  const cached = analysisCache[cacheKey];
  if (cached && Date.now() < cached.expiresAt) {
    return cached.result;
  }
  return null;
};

/**
 * Cache analysis result
 */
const cacheAnalysis = (cacheKey: string, result: AIAnalysisResult): void => {
  analysisCache[cacheKey] = {
    result,
    timestamp: Date.now(),
    expiresAt: Date.now() + AI_CONFIG.CACHE_DURATION,
  };
};

/**
 * Enhanced 5(1's) strategy logic with more factors
 */
const applyFiveOnesStrategy = (matchData: MatchData): { 
  confidence: number; 
  reasoning: string; 
  keyFactors: string[] 
} => {
  let confidence = 50; // Base confidence
  let keyFactors: string[] = [];

  // 1. Recent Form Analysis (40% weight)
  const homeRecentForm = matchData.homeForm.slice(0, 5);
  const awayRecentForm = matchData.awayForm.slice(0, 5);
  
  const homeFormScore = homeRecentForm.filter(result => result === "W").length * 20;
  const awayFormScore = awayRecentForm.filter(result => result === "W").length * 20;
  
  confidence += (homeFormScore - awayFormScore);
  if (homeFormScore > awayFormScore) keyFactors.push("Home team has better recent form");
  if (awayFormScore > homeFormScore) keyFactors.push("Away team has better recent form");

  // 2. Goal Statistics (25% weight)
  const homeGoalDiff = matchData.homeStats.goalsScored - matchData.homeStats.goalsConceded;
  const awayGoalDiff = matchData.awayStats.goalsScored - matchData.awayStats.goalsConceded;
  
  if (homeGoalDiff > awayGoalDiff + 5) {
    confidence += 12;
    keyFactors.push("Home team has significantly better goal difference");
  } else if (homeGoalDiff > awayGoalDiff) {
    confidence += 6;
    keyFactors.push("Home team has better goal difference");
  } else if (awayGoalDiff > homeGoalDiff + 5) {
    confidence -= 12;
    keyFactors.push("Away team has significantly better goal difference");
  } else if (awayGoalDiff > homeGoalDiff) {
    confidence -= 6;
    keyFactors.push("Away team has better goal difference");
  }

  // 3. Defensive Strength (15% weight)
  const homeDefense = matchData.homeStats.cleanSheets / Math.max(matchData.homeForm.length, 1);
  const awayDefense = matchData.awayStats.cleanSheets / Math.max(matchData.awayForm.length, 1);
  
  if (homeDefense > awayDefense + 0.2) {
    confidence += 8;
    keyFactors.push("Home team has stronger defense");
  } else if (awayDefense > homeDefense + 0.2) {
    confidence -= 8;
    keyFactors.push("Away team has stronger defense");
  }

  // 4. Head-to-Head Analysis (10% weight)
  const recentH2H = matchData.headToHead.slice(0, 5);
  const homeH2HWins = recentH2H.filter(result => result === "H").length;
  const awayH2HWins = recentH2H.filter(result => result === "A").length;
  
  if (homeH2HWins > awayH2HWins) {
    confidence += 5;
    keyFactors.push("Home team has better head-to-head record");
  } else if (awayH2HWins > homeH2HWins) {
    confidence -= 5;
    keyFactors.push("Away team has better head-to-head record");
  }

  // 5. Venue Advantage (5% weight)
  if (matchData.venue === 'home') {
    confidence += 5;
    keyFactors.push("Home venue advantage");
  }

  // 6. Match Importance (5% weight)
  if (matchData.importance === 'high') {
    // High importance matches tend to be more conservative
    confidence = confidence * 0.9 + 5; // Slight adjustment
    keyFactors.push("High importance match - expect cautious play");
  }

  return {
    confidence: Math.max(10, Math.min(90, confidence)), // Clamp between 10-90
    reasoning: keyFactors.join(". ") || "Balanced match with no clear advantage",
    keyFactors
  };
};

/**
 * Generate expected score based on statistics
 */
const generateExpectedScore = (matchData: MatchData): string => {
  const homeAvgGoals = matchData.homeStats.goalsScored / Math.max(matchData.homeForm.length, 1);
  const awayAvgGoals = matchData.awayStats.goalsScored / Math.max(matchData.awayForm.length, 1);
  const homeAvgConceded = matchData.homeStats.goalsConceded / Math.max(matchData.homeForm.length, 1);
  const awayAvgConceded = matchData.awayStats.goalsConceded / Math.max(matchData.awayForm.length, 1);

  const expectedHome = (homeAvgGoals + awayAvgConceded) / 2;
  const expectedAway = (awayAvgGoals + homeAvgConceded) / 2;

  // Round to nearest 0.5 and format
  const homeScore = Math.round(expectedHome * 2) / 2;
  const awayScore = Math.round(expectedAway * 2) / 2;

  return `${homeScore.toFixed(1)} - ${awayScore.toFixed(1)}`;
};

/**
 * Generate alternative betting options
 */
const generateAlternativeBets = (matchData: MatchData, prediction: string): string[] => {
  const alternatives: string[] = [];
  const totalGoalsExpected = 
    (matchData.homeStats.goalsScored + matchData.awayStats.goalsScored) / 
    Math.max(matchData.homeForm.length + matchData.awayForm.length, 2);

  // Both teams to score
  const bothTeamsScoreProbability = 
    (matchData.homeStats.goalsScored > 0 && matchData.awayStats.goalsScored > 0) ? 0.7 : 0.3;
  if (bothTeamsScoreProbability > 0.6) {
    alternatives.push("Both teams to score");
  }

  // Over/Under goals
  if (totalGoalsExpected > 2.5) {
    alternatives.push("Over 2.5 goals");
  } else {
    alternatives.push("Under 2.5 goals");
  }

  // Double chance
  if (prediction === "home") {
    alternatives.push("Double chance: Home/Draw");
  } else if (prediction === "away") {
    alternatives.push("Double chance: Away/Draw");
  } else {
    alternatives.push("Double chance: Home/Away");
  }

  // Correct score suggestions
  if (totalGoalsExpected > 3) {
    alternatives.push("Correct score: 2-1, 3-1");
  } else {
    alternatives.push("Correct score: 1-0, 1-1, 0-1");
  }

  return alternatives;
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
    riskLevel = strategy.confidence > 75 ? "low" : "medium";
  } else if (strategy.confidence < 45) {
    prediction = "away";
    riskLevel = strategy.confidence < 35 ? "low" : "medium";
  } else {
    prediction = "draw";
    riskLevel = "high";
  }

  const expectedScore = generateExpectedScore(matchData);
  const alternativeBets = generateAlternativeBets(matchData, prediction);

  return {
    prediction,
    confidence: strategy.confidence,
    reasoning: strategy.reasoning,
    strategy: "Enhanced 5(1's) Strategy - Multi-factor statistical analysis",
    riskLevel,
    expectedScore,
    keyFactors: strategy.keyFactors,
    alternativeBets,
    timestamp: new Date(),
    analysisId: `fallback_${Date.now()}`,
  };
};

/**
 * Call external AI API for analysis with enhanced error handling
 */
const callAIAPI = async (matchData: MatchData): Promise<AIAnalysisResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(AI_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_AI_API_KEY || "",
      },
      body: JSON.stringify({
        matchData,
        strategy: "5ones",
        options: {
          includeExpectedScore: true,
          includeAlternatives: true,
          riskAssessment: true
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const result = await response.json();
    
    // Validate API response
    if (!result.prediction || !result.confidence) {
      throw new Error("Invalid API response format");
    }

    return {
      ...result,
      timestamp: new Date(),
      analysisId: `ai_${Date.now()}`,
    } as AIAnalysisResult;

  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Validate match data before analysis
 */
const validateMatchData = (matchData: MatchData): string[] => {
  const errors: string[] = [];

  if (!matchData.homeTeam || !matchData.awayTeam) {
    errors.push("Missing team names");
  }

  if (matchData.homeForm.length === 0 || matchData.awayForm.length === 0) {
    errors.push("Insufficient form data");
  }

  if (matchData.headToHead.length === 0) {
    errors.push("No head-to-head data available");
  }

  return errors;
};

/**
 * Main analysis function with cache, retry, and fallback logic
 */
export const analyzeMatch = async (
  matchData: MatchData,
  useCache: boolean = true
): Promise<AIAnalysisResult> => {
  // Validate input data
  const validationErrors = validateMatchData(matchData);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid match data: ${validationErrors.join(", ")}`);
  }

  // Check cache first
  const cacheKey = generateCacheKey(matchData);
  if (useCache) {
    const cachedResult = getCachedAnalysis(cacheKey);
    if (cachedResult) {
      console.log("Returning cached analysis result");
      return cachedResult;
    }
  }

  let lastError: Error | null = null;

  // Try AI API with retries
  for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`AI Analysis attempt ${attempt}/${AI_CONFIG.MAX_RETRIES}`);
      const result = await callAIAPI(matchData);
      
      // Cache successful result
      cacheAnalysis(cacheKey, result);
      return result;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${attempt} failed:`, lastError.message);

      // Wait before retry (exponential backoff)
      if (attempt < AI_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // If AI API fails after retries, use fallback
  if (AI_CONFIG.FALLBACK_ENABLED) {
    console.log("Falling back to local analysis strategy");
    const fallbackResult = fallbackAnalysis(matchData);
    
    // Cache fallback result with shorter expiration
    cacheAnalysis(cacheKey, fallbackResult);
    return fallbackResult;
  }

  throw lastError || new Error("AI analysis failed after all retries");
};

/**
 * Utility function to clear analysis cache
 */
export const clearAnalysisCache = (): void => {
  Object.keys(analysisCache).forEach(key => {
    delete analysisCache[key];
  });
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): { size: number; hits: number } => {
  const now = Date.now();
  let hits = 0;

  // Clean expired entries and count valid ones
  Object.keys(analysisCache).forEach(key => {
    if (analysisCache[key].expiresAt < now) {
      delete analysisCache[key];
    } else {
      hits++;
    }
  });

  return { size: Object.keys(analysisCache).length, hits };
};