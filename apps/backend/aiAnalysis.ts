import { 
  MatchData, 
  AIAnalysisResult, 
  AnalysisCache,
  AnalysisRequest,
  AnalysisResponse 
} from '../types';

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

// ... rest of your existing functions remain the same
// Just update the imports at the top

/**
 * Main analysis function with proper typing
 */
export const analyzeMatch = async (
  matchData: MatchData,
  useCache: boolean = true
): Promise<AIAnalysisResult> => {
  // Your existing implementation
};

/**
 * Enhanced analysis with request/response pattern
 */
export const analyzeMatchEnhanced = async (
  request: AnalysisRequest
): Promise<AnalysisResponse> => {
  try {
    const result = await analyzeMatch(request.matchData, request.useCache);
    return {
      success: true,
      data: result,
      cached: false
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};