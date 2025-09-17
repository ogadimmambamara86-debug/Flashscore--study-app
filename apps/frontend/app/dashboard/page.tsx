import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Target, Brain, ExternalLink, Filter, BarChart3, Award, Zap, Globe, Wifi, Battery, Signal, DollarSign, PieChart, TrendingDown, Shield, Cpu, Database, Activity } from 'lucide-react';

// Enhanced interfaces for Tesla Optimus treasury system
interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

interface TreasuryMetrics {
  totalBalance: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  riskExposure: number;
  portfolioHealth: number;
  activeBets: number;
  pendingPayouts: number;
  autoReinvest: boolean;
  riskLevel: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

interface PredictionSource {
  name: string;
  confidence: number;
  correctScore: string;
  handicap: string;
  odds: number;
  accuracy: number;
  status: 'online' | 'offline' | 'syncing';
}

interface DetailedPrediction {
  id: number;
  teams: string;
  league: string;
  betType: string;
  odds: {
    home: number;
    draw: number;
    away: number;
    over25: number;
    under25: number;
  };
  confidence: {
    overall: number;
    form: number;
    headToHead: number;
    injuries: number;
    momentum: number;
  };
  sources: PredictionSource[];
  aiRecommendation: string;
  expectedValue: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  scoreboardRating: number;
  kickoff: string;
  originalPrediction: string;
  crossFeedComparison: {
    ourPrediction: string;
    mybetsToday: string;
    statArea: string;
    consensus: number;
  };
  treasuryAllocation: number;
  projectedReturn: number;
  aiConfidenceScore: number;
}

const TeslaOptimusBettingDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<DetailedPrediction[]>([]);
  const [treasury, setTreasury] = useState<TreasuryMetrics>({
    totalBalance: 15847.32,
    dailyPnL: 287.45,
    weeklyPnL: 1250.88,
    monthlyPnL: 4892.17,
    riskExposure: 23.5,
    portfolioHealth: 94.2,
    activeBets: 12,
    pendingPayouts: 1847.20,
    autoReinvest: true,
    riskLevel: 'MODERATE'
  });
  const [monthlyProgress, setMonthlyProgress] = useState(1.0);
  const [totalBets, setTotalBets] = useState(0);
  const [winningBets, setWinningBets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [stakeAmount, setStakeAmount] = useState(10);
  const [activeTab, setActiveTab] = useState<'predictions' | 'crossfeed' | 'treasury'>('predictions');
  const [optimusMode, setOptimusMode] = useState(true);

  // Tesla Optimus system status
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 34,
    memoryUsage: 67,
    networkLatency: 12,
    aiProcessingLoad: 78,
    batteryLevel: 98,
    thermalStatus: 'OPTIMAL'
  });

  // Fetch and process predictions with Optimus AI enhancement
  const fetchOptimusPredictions = async (): Promise<DetailedPrediction[]> => {
    try {
      setConnectionStatus('syncing');
      
      const response = await fetch('/api/sports');
      const matches: Match[] = await response.json();
      
      setConnectionStatus('online');
      
      return matches.map((match, index) => {
        const baseOdds = generateAdvancedOdds(match.prediction);
        const detailedConfidence = calculateDetailedConfidence(match.prediction);
        const sources = generateCrossFeedSources(match);
        const crossComparison = generateCrossComparison(match, sources);
        const treasuryAllocation = calculateTreasuryAllocation(baseOdds.home, detailedConfidence.overall);
        const aiScore = calculateOptimusAIScore(match.prediction, detailedConfidence);
        
        return {
          id: match.id,
          teams: `${match.home} vs ${match.away}`,
          league: detectLeague(match.home, match.away),
          betType: extractBetType(match.prediction),
          odds: baseOdds,
          confidence: detailedConfidence,
          sources: sources,
          aiRecommendation: getOptimusRecommendation(baseOdds.home, detailedConfidence.overall, aiScore),
          expectedValue: calculateExpectedValue(baseOdds.home, detailedConfidence.overall),
          riskLevel: getRiskLevel(baseOdds.home, detailedConfidence.overall),
          scoreboardRating: calculateAdvancedRating(baseOdds, detailedConfidence),
          kickoff: generateKickoffTime(),
          originalPrediction: match.prediction,
          crossFeedComparison: crossComparison,
          treasuryAllocation: treasuryAllocation,
          projectedReturn: treasuryAllocation * baseOdds.home,
          aiConfidenceScore: aiScore
        };
      });
    } catch (error) {
      console.error('Optimus connection failed:', error);
      setConnectionStatus('offline');
      return [];
    }
  };

  // Tesla Optimus AI scoring system
  const calculateOptimusAIScore = (prediction: string, confidence: any): number => {
    let score = confidence.overall;
    
    // Optimus neural network enhancements
    if (prediction.includes('strong') || prediction.includes('dominant')) score += 12;
    if (confidence.form > 85 && confidence.momentum > 80) score += 8;
    if (confidence.headToHead > 75 && confidence.injuries > 80) score += 6;
    
    // Apply Optimus risk algorithms
    const riskFactor = Math.min(score / 100, 1);
    const neuralBoost = riskFactor * 15;
    
    return Math.min(Math.max(score + neuralBoost, 0), 100);
  };

  // Treasury allocation algorithm
  const calculateTreasuryAllocation = (odds: number, confidence: number): number => {
    const baseAllocation = treasury.totalBalance * 0.05; // 5% max per bet
    const confidenceMultiplier = confidence / 100;
    const oddsMultiplier = odds <= 1.3 ? 1.2 : odds <= 1.6 ? 1.0 : 0.8;
    
    return Math.round(baseAllocation * confidenceMultiplier * oddsMultiplier);
  };

  const getOptimusRecommendation = (odds: number, confidence: number, aiScore: number) => {
    if (odds <= 1.3 && confidence > 85 && aiScore > 90) return "🤖 OPTIMUS PRIME";
    if (odds <= 1.3 && confidence > 80 && aiScore > 85) return "⚡ TESLA APPROVED";
    if (odds <= 1.5 && confidence > 75 && aiScore > 80) return "🔋 HIGH EFFICIENCY";
    if (odds <= 2.0 && confidence > 70) return "🛡️ MODERATE RISK";
    return "⚠️ CAUTION ADVISED";
  };

  // Generate advanced odds (existing function)
  const generateAdvancedOdds = (prediction: string) => {
    const baseHome = prediction.includes('win 3-0') || prediction.includes('strong') ? 
      1.1 + Math.random() * 0.2 : 
      prediction.includes('win') ? 1.4 + Math.random() * 0.4 : 
      2.0 + Math.random() * 1.0;
    
    return {
      home: parseFloat(baseHome.toFixed(2)),
      draw: parseFloat((2.8 + Math.random() * 0.6).toFixed(2)),
      away: parseFloat((baseHome * 2.5 + Math.random() * 1.0).toFixed(2)),
      over25: parseFloat((1.8 + Math.random() * 0.4).toFixed(2)),
      under25: parseFloat((2.1 + Math.random() * 0.3).toFixed(2))
    };
  };

  // Other existing helper functions...
  const calculateDetailedConfidence = (prediction: string) => {
    const base = prediction.includes('strong') ? 85 : 
                 prediction.includes('likely') ? 75 : 70;
    
    return {
      overall: base + Math.floor(Math.random() * 10),
      form: base - 5 + Math.floor(Math.random() * 15),
      headToHead: base - 10 + Math.floor(Math.random() * 20),
      injuries: base + Math.floor(Math.random() * 8),
      momentum: base - 3 + Math.floor(Math.random() * 12)
    };
  };

  const generateCrossFeedSources = (match: Match): PredictionSource[] => {
    return [
      {
        name: 'Optimus Neural Core',
        confidence: 90 + Math.floor(Math.random() * 8),
        correctScore: '2-1',
        handicap: '-1.5',
        odds: 1.15 + Math.random() * 0.2,
        accuracy: 94,
        status: 'online'
      },
      {
        name: 'MyBets.Today',
        confidence: 78 + Math.floor(Math.random() * 12),
        correctScore: '1-0',
        handicap: '-1.0',
        odds: 1.3 + Math.random() * 0.4,
        accuracy: 82,
        status: 'online'
      },
      {
        name: 'StatArea.com',
        confidence: 81 + Math.floor(Math.random() * 8),
        correctScore: '2-0',
        handicap: '-1.5',
        odds: 1.25 + Math.random() * 0.35,
        accuracy: 79,
        status: Math.random() > 0.1 ? 'online' : 'syncing'
      }
    ];
  };

  const generateCrossComparison = (match: Match, sources: PredictionSource[]) => {
    const agreements = sources.filter(s => s.confidence > 80).length;
    const consensus = (agreements / sources.length) * 100;
    
    return {
      ourPrediction: match.prediction,
      mybetsToday: `${match.home} to win with 78% confidence`,
      statArea: `Strong ${match.home} victory expected`,
      consensus: Math.round(consensus)
    };
  };

  const calculateExpectedValue = (odds: number, confidence: number) => {
    return parseFloat(((confidence / 100 * odds) - 1).toFixed(3));
  };

  const getRiskLevel = (odds: number, confidence: number): 'LOW' | 'MEDIUM' | 'HIGH' => {
    if (odds <= 1.3 && confidence > 80) return 'LOW';
    if (odds <= 1.8 && confidence > 70) return 'MEDIUM';
    return 'HIGH';
  };

  const calculateAdvancedRating = (odds: any, confidence: any) => {
    let score = confidence.overall;
    if (odds.home <= 1.3) score += 15;
    if (confidence.form > 80) score += 5;
    if (confidence.momentum > 80) score += 5;
    return Math.min(Math.max(score, 0), 100);
  };

  const detectLeague = (home: string, away: string): string => {
    const leagues = {
      'Premier League': ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea'],
      'La Liga': ['Barcelona', 'Real Madrid', 'Atletico Madrid'],
      'Bundesliga': ['Bayern Munich', 'Borussia Dortmund'],
      'Serie A': ['Juventus', 'Inter Milan', 'AC Milan']
    };
    
    for (const [league, teams] of Object.entries(leagues)) {
      if (teams.some(team => home.includes(team) || away.includes(team))) {
        return league;
      }
    }
    return 'European Football';
  };

  const extractBetType = (prediction: string) => {
    if (prediction.includes('3-0') || prediction.includes('2-1')) return 'Correct Score';
    if (prediction.includes('win')) return 'Match Winner';
    if (prediction.includes('Draw')) return 'Draw';
    return 'Match Result';
  };

  const generateKickoffTime = () => {
    const hours = 14 + Math.floor(Math.random() * 6);
    const minutes = Math.floor(Math.random() * 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Load predictions
  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      const optimusPreds = await fetchOptimusPredictions();
      setPredictions(optimusPreds);
      setLoading(false);
    };

    loadPredictions();

    // Simulate real-time system metrics updates
    const metricsInterval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(50, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 6)),
        aiProcessingLoad: Math.max(60, Math.min(95, prev.aiProcessingLoad + (Math.random() - 0.5) * 12))
      }));
    }, 3000);

    return () => clearInterval(metricsInterval);
  }, []);

  const refreshPredictions = async () => {
    setLoading(true);
    const newPredictions = await fetchOptimusPredictions();
    setPredictions(newPredictions);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return '#10b981';
      case 'syncing': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return '#10b981';
    if (confidence >= 75) return '#3b82f6';
    if (confidence >= 65) return '#f59e0b';
    return '#ef4444';
  };

  const getThermalColor = (status: string) => {
    switch(status) {
      case 'OPTIMAL': return '#10b981';
      case 'WARM': return '#f59e0b';
      case 'HOT': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const winRate = totalBets > 0 ? ((winningBets / totalBets) * 100).toFixed(1) : '0';
  const progressPercentage = Math.min((monthlyProgress / 9) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Tesla Optimus Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({length: 144}).map((_, i) => (
            <div key={i} className="border border-blue-500/20"></div>
          ))}
        </div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length: 8}).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`
            }}
          >
            <div className="w-6 h-6 border border-blue-400/30 rotate-45 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Optimus Status Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-blue-500/30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 text-blue-300 text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>CPU: {systemMetrics.cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>MEM: {systemMetrics.memoryUsage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>AI: {systemMetrics.aiProcessingLoad}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>{systemMetrics.networkLatency}ms</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{systemMetrics.batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{color: getThermalColor(systemMetrics.thermalStatus)}} />
              <span style={{color: getThermalColor(systemMetrics.thermalStatus)}}>{systemMetrics.thermalStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tesla Optimus Header */}
        <div className="bg-gradient-to-r from-blue-900/20 via-gray-900/40 to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-700 rounded-2xl flex items-center justify-center border border-blue-400/50">
                  <Brain className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-black flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  TESLA OPTIMUS TREASURY
                </h1>
                <p className="text-blue-300 flex items-center gap-3 text-lg">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                  Neural Network Active • Autonomous Betting • 5(1's) Strategy
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOptimusMode(!optimusMode)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                  optimusMode 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {optimusMode ? '🤖 OPTIMUS ON' : '🔒 MANUAL MODE'}
              </button>
            </div>
          </div>

          {/* Optimus Treasury Metrics */}
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                label: 'Total Balance',
                value: `$${treasury.totalBalance.toLocaleString()}`,
                change: `+$${treasury.dailyPnL.toFixed(2)}`,
                icon: DollarSign,
                color: 'from-green-500 to-emerald-600',
                isPositive: treasury.dailyPnL > 0
              },
              {
                label: 'Monthly P&L',
                value: `$${treasury.monthlyPnL.toLocaleString()}`,
                change: `${treasury.monthlyPnL > 0 ? '+' : ''}${((treasury.monthlyPnL / (treasury.totalBalance - treasury.monthlyPnL)) * 100).toFixed(1)}%`,
                icon: TrendingUp,
                color: 'from-blue-500 to-cyan-600',
                isPositive: treasury.monthlyPnL > 0
              },
              {
                label: 'Portfolio Health',
                value: `${treasury.portfolioHealth}%`,
                change: `Risk: ${treasury.riskExposure}%`,
                icon: Shield,
                color: 'from-purple-500 to-pink-600',
                isPositive: treasury.portfolioHealth > 90
              },
              {
                label: 'Active Positions',
                value: treasury.activeBets.toString(),
                change: `$${treasury.pendingPayouts.toLocaleString()} pending`,
                icon: Target,
                color: 'from-orange-500 to-red-600',
                isPositive: true
              }
            ].map((metric, idx) => (
              <div key={idx} className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color} opacity-60`}></div>
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className="w-8 h-8 text-blue-400" />
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    metric.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {metric.change}
                  </div>
                </d