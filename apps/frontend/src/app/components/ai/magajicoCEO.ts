
// CEO: Decides what is important and what should happen
// Enhanced with strategic thinking patterns from tech leaders
export interface Prediction {
  match: string;
  prediction: string;
  confidence: number;
  marketValue?: number;
  riskFactor?: number;
}

export type CEOAction =
  | { type: "ALERT"; message: string; level: "info" | "success" | "warning" | "danger" }
  | { type: "HIGHLIGHT"; match: string }
  | { type: "STRATEGIC_MOVE"; action: string; reasoning: string }
  | { type: "MARKET_OPPORTUNITY"; prediction: Prediction; potential: number }
  | { type: "IGNORE" };

interface StrategicThinking {
  longTermVision: boolean;
  disruptiveInnovation: boolean;
  marketDomination: boolean;
  riskTolerance: number;
  executionSpeed: number;
}

// Strategic patterns inspired by tech leaders
const STRATEGIC_PATTERNS: StrategicThinking = {
  longTermVision: true, // Jeff Bezos - long-term thinking
  disruptiveInnovation: true, // Elon Musk - revolutionary approach  
  marketDomination: true, // Bill Gates - market positioning
  riskTolerance: 0.7, // Jack Ma - calculated risks
  executionSpeed: 0.9 // All leaders - fast execution
};

export function magajicoCEO(predictions: Prediction[]): CEOAction[] {
  const actions: CEOAction[] = [];

  // Enhanced strategic analysis
  predictions.forEach((p) => {
    const strategicValue = calculateStrategicValue(p);
    
    if (p.confidence > 85 && strategicValue > 0.8) {
      // High-confidence, high-value opportunities (Musk-style bold moves)
      actions.push({
        type: "MARKET_OPPORTUNITY",
        prediction: p,
        potential: strategicValue * 100
      });
      
      actions.push({
        type: "ALERT",
        message: `🚀 STRATEGIC OPPORTUNITY: ${p.match} - Confidence: ${p.confidence}% | Market Value: ${Math.round(strategicValue * 100)}%`,
        level: "success",
      });
      
      actions.push({ type: "HIGHLIGHT", match: p.match });
    } 
    else if (p.confidence > 70 && strategicValue > 0.6) {
      // Medium opportunities with growth potential (Gates-style market positioning)
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `POSITION_FOR_GROWTH: ${p.match}`,
        reasoning: `Market positioning opportunity with ${p.confidence}% confidence`
      });
      
      actions.push({
        type: "ALERT",
        message: `📈 Market Positioning: ${p.match} - ${p.prediction} (${p.confidence}%)`,
        level: "info",
      });
    }
    else if (p.confidence < 40 || (p.riskFactor && p.riskFactor > 0.7)) {
      // High-risk scenarios (Bezos-style long-term caution)
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `RISK_MITIGATION: ${p.match}`,
        reasoning: "Long-term risk management - avoid potential losses"
      });
      
      actions.push({
        type: "ALERT",
        message: `⚠️ Strategic Risk: ${p.match} - Proceed with caution`,
        level: "warning",
      });
    } 
    else {
      // Standard monitoring (Ma-style patient observation)
      actions.push({ type: "IGNORE" });
    }
  });

  // Add strategic oversight actions
  if (predictions.length > 0) {
    const highValueCount = predictions.filter(p => calculateStrategicValue(p) > 0.7).length;
    
    if (highValueCount > 2) {
      actions.push({
        type: "STRATEGIC_MOVE",
        action: "SCALE_OPERATIONS",
        reasoning: `${highValueCount} high-value opportunities detected - time to scale`
      });
    }
  }

  return actions;
}

function calculateStrategicValue(prediction: Prediction): number {
  let value = prediction.confidence / 100;
  
  // Market value consideration (Gates-style)
  if (prediction.marketValue) {
    value *= (1 + prediction.marketValue / 100);
  }
  
  // Risk adjustment (Bezos-style long-term thinking)
  if (prediction.riskFactor) {
    value *= (1 - prediction.riskFactor * STRATEGIC_PATTERNS.riskTolerance);
  }
  
  // Innovation bonus (Musk-style disruption)
  if (STRATEGIC_PATTERNS.disruptiveInnovation && prediction.confidence > 80) {
    value *= 1.2; // 20% bonus for high-confidence disruptive opportunities
  }
  
  // Execution speed factor (Ma-style rapid execution)
  value *= STRATEGIC_PATTERNS.executionSpeed;
  
  return Math.min(value, 1.0); // Cap at 100%
}

// Strategic intelligence metrics
export function getStrategicInsights(predictions: Prediction[]): {
  totalOpportunities: number;
  marketDominanceScore: number;
  innovationIndex: number;
  riskManagementScore: number;
} {
  const opportunities = predictions.filter(p => calculateStrategicValue(p) > 0.6);
  
  return {
    totalOpportunities: opportunities.length,
    marketDominanceScore: Math.round(opportunities.reduce((sum, p) => sum + calculateStrategicValue(p), 0) * 10),
    innovationIndex: Math.round((opportunities.filter(p => p.confidence > 80).length / predictions.length) * 100),
    riskManagementScore: Math.round((1 - opportunities.filter(p => p.riskFactor && p.riskFactor > 0.5).length / predictions.length) * 100)
  };
}
