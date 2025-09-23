export interface AIAnalysisResult {
  prediction: "home" | "away" | "draw";
  confidence: number;
  reasoning: string;
  strategy: string;
  riskLevel: "low" | "medium" | "high";
  alternativeBets: string[];
  keyFactors: string[];
  timestamp: Date;
  analysisId: string;
  matchId?: string;
}

export interface AnalysisRequest {
  matchData: MatchData;
  includeDetailed?: boolean;
  modelVersion?: string;
}

export interface HistoricalAnalysis {
  accuracy: number;
  successfulPredictions: number;
  totalPredictions: number;
  roi: number;
}