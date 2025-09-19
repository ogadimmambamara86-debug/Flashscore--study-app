// aiAnalysis.ts
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
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  reasoning: string;
  strategy: string;
  riskLevel: 'low' | 'medium' | 'high';
  alternativeBets?: string[];
}

// Configuration for AI analysis
const AI_CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_AI_API_ENDPOINT || '/api/ai-analysis',
  FALLBACK_ENABLED: true,
  TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
};

/**
 * Apply the 5(1's) strategy logic
 * This is a betting strategy that focuses on specific patterns
 */
const applyFiveOnesStrategy = (matchData: MatchData): { confidence: number; reasoning: string } => {
  let confidence = 50; // Base confidence
  const reasons: string[] = [];

  // Analyze recent form (last 5 matches)
  const homeWins = matchData.homeForm.filter(result => result === 'W').length;
  const awayWins = matchData.awayForm.filter(result => result === 'W').length;
  
  if (homeWins >= 4) {
    confidence += 20;
    reasons.push(`Home team has ${homeWins}/5 recent wins`);
  }
  
  if (awayWins >= 4) {
    confidence -= 15;
    reasons.push(`Away team has strong form with ${awayWins}/5 wins`);
  }

  // Goal difference analysis
  const homeGoalDiff = matchData.homeStats.goalsScored - matchData.homeStats.goalsConceded;
  const awayGoalDiff = matchData.awayStats.goalsScored - matchData.awayStats.goalsConceded;
  
  if (homeGoalDiff > awayGoalDiff + 5) {
    confidence += 15;
    reasons.push('Home team has superior goal difference');
  }

  // Head-to-head analysis
  const homeH2HWins = matchData.headToHead.filter(result => result === 'H').length;
  if (homeH2HWins >= 3) {
    confidence += 10;
    reasons.push('Home team dominates head-to-head record');
  }

  return {
    confidence: Math.min(Math.max(confidence, 0), 100),
    reasoning: reasons.join(', ')
  };
};

/**
 * Fallback analysis when AI is not available
 */
const fallbackAnalysis = (matchData: MatchData): AIAnalysisResult => {
  const strategy = applyFiveOnesStrategy(matchData);
  
  // Simple rule-based prediction
  const homeStrength = matchData.homeStats.goalsScored - matchData.homeStats.goalsConceded;
  const awayStrength = matchData.awayStats.goalsScored - matchData.awayStats.goalsConceded;
  
  let prediction: 'home' | 'draw' | 'away';
  if (homeStrength > awayStrength + 2) {
    prediction = 'home';
  } else if (awayStrength > homeStrength + 2) {
    prediction = 'away';
  } else {
    prediction = 'draw';
  }

  const riskLevel: 'low' | 'medium' | 'high' = 
    strategy.confidence >= 70 ? 'low' : 
    strategy.confidence >= 50 ? 'medium' : 'high';

  return {
    prediction,
    confidence: strategy.confidence,
    reasoning: `Fallback analysis: ${strategy.reasoning}`,
    strategy: '5(1\'s) Strategy Applied',
    riskLevel,
    alternativeBets: ['Over 2.5 goals', 'Both teams to score']
  };
};

/**
 * Send match data to AI for analysis
 */
const analyzeWithAI = async (matchData: MatchData): Promise<AIAnalysisResult> => {
  // Input validation
  if (!matchData || !matchData.homeTeam || !matchData.awayTeam) {
    throw new Error('Invalid match data provided');
  }

  let retries = 0;
  const maxRetries = AI_CONFIG.MAX_RETRIES;

  while (retries < maxRetries) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT_MS);

      const response = await fetch(AI_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: generateAIPrompt(matchData),
          temperature: 0.3, // Lower temperature for more consistent analysis
          max_tokens: 500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const aiResponse = await response.json();
      
      // Parse AI response and apply 5(1's) strategy
      const analysis = parseAIResponse(aiResponse, matchData);
      
      return analysis;

    } catch (error) {
      retries++;
      console.warn(`AI analysis attempt ${retries} failed:`, error);
      
      if (retries >= maxRetries) {
        if (AI_CONFIG.FALLBACK_ENABLED) {
          console.log('AI analysis failed, using fallback analysis');
          return fallbackAnalysis(matchData);
        } else {
          throw new Error(`AI analysis failed after ${maxRetries} attempts: ${error.message}`);
        }
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }

  // This should never be reached, but TypeScript needs it
  return fallbackAnalysis(matchData);
};

/**
 * Generate prompt for AI analysis
 */
const generateAIPrompt = (matchData: MatchData): string => {
  return `
Analyze this football match and provide a prediction using the 5(1's) strategy:

Match: ${matchData.homeTeam} vs ${matchData.awayTeam}

Home Team Stats:
- Recent form: ${matchData.homeForm.join(', ')}
- Goals scored: ${matchData.homeStats.goalsScored}
- Goals conceded: ${matchData.homeStats.goalsConceded}
- Clean sheets: ${matchData.homeStats.cleanSheets}

Away Team Stats:
- Recent form: ${matchData.awayForm.join(', ')}
- Goals scored: ${matchData.awayStats.goalsScored}
- Goals conceded: ${matchData.awayStats.goalsConceded}
- Clean sheets: ${matchData.awayStats.cleanSheets}

Head-to-head: ${matchData.headToHead.join(', ')}
${matchData.odds ? `Odds - Home: ${matchData.odds.home}, Draw: ${matchData.odds.draw}, Away: ${matchData.odds.away}` : ''}

Please provide:
1. Prediction (home/draw/away)
2. Confidence score (0-100)
3. Reasoning
4. Risk assessment
5. Alternative betting options

Focus on statistical patterns and recent form trends.
`;
};

/**
 * Parse AI response and enhance with 5(1's) strategy
 */
const parseAIResponse = (aiResponse: any, matchData: MatchData): AIAnalysisResult => {
  try {
    // Apply 5(1's) strategy logic
    const strategyResult = applyFiveOnesStrategy(matchData);
    
    // Parse AI response (this depends on your AI API format)
    const aiText = aiResponse.choices?.[0]?.message?.content || aiResponse.text || '';
    
    // Extract prediction from AI text (simplified parsing)
    let prediction: 'home' | 'draw' | 'away' = 'draw';
    if (aiText.toLowerCase().includes('home win') || aiText.toLowerCase().includes('home team')) {
      prediction = 'home';
    } else if (aiText.toLowerCase().includes('away win') || aiText.toLowerCase().includes('away team')) {
      prediction = 'away';
    }
    
    // Combine AI confidence with strategy confidence
    const combinedConfidence = Math.round((strategyResult.confidence + (aiResponse.confidence || 50)) / 2);
    
    const riskLevel: 'low' | 'medium' | 'high' = 
      combinedConfidence >= 70 ? 'low' : 
      combinedConfidence >= 50 ? 'medium' : 'high';

    return {
      prediction,
      confidence: combinedConfidence,
      reasoning: `AI Analysis: ${aiText.slice(0, 200)}... | Strategy: ${strategyResult.reasoning}`,
      strategy: '5(1\'s) Strategy + AI Analysis',
      riskLevel,
      alternativeBets: ['Over 2.5 goals', 'Both teams to score', 'Handicap betting']
    };
    
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return fallbackAnalysis(matchData);
  }
};

/**
 * Main export function - analyze match with AI
 */
export const analyzeMatch = async (matchData: MatchData): Promise<AIAnalysisResult> => {
  try {
    return await analyzeWithAI(matchData);
  } catch (error) {
    console.error('Match analysis failed:', error);
    
    if (AI_CONFIG.FALLBACK_ENABLED) {
      return fallbackAnalysis(matchData);
    }
    
    throw error;
  }
};

/**
 * Utility function to format analysis results
 */
export const formatAnalysisResult = (result: AIAnalysisResult): string => {
  return `
Prediction: ${result.prediction.toUpperCase()}
Confidence: ${result.confidence}%
Risk Level: ${result.riskLevel.toUpperCase()}
Strategy: ${result.strategy}
Reasoning: ${result.reasoning}
${result.alternativeBets ? `Alternative Bets: ${result.alternativeBets.join(', ')}` : ''}
  `.trim();
};

// Export types for use in other components
export type { MatchData, AIAnalysisResult };