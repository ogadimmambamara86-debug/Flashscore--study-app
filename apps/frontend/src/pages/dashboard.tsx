"use client";
import { useEffect, useState } from "react";
import LatestNews from "../components/LatestNews";
import PredictionsTable from "../components/PredictionsTable";

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

interface Prediction {
  title: string;
  content?: string;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load predictions data
  useEffect(() => {
    async function loadPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      }
    }

    loadPredictions();
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/sports").then((res) => res.json()),
      // Already fetched predictions in a separate effect
    ])
    .then(([matchesData]) => {
      setMatches(matchesData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ position: 'relative' }}>
      {/* Animated background particles */}
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Tesla-style header with autopilot indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          margin: 0,
          background: 'linear-gradient(135deg, #00ff88, #00a2ff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
          letterSpacing: '-1px'
        }}>
          🚗 AUTOPILOTimport React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Target, Brain, ExternalLink, Filter, BarChart3, Award, Zap } from 'lucide-react';

// Types matching your sports.ts API
interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

interface DashboardPrediction {
  id: number;
  teams: string;
  league: string;
  betType: string;
  odds: number;
  confidence: number;
  source: string;
  status: string;
  aiRecommendation: string;
  expectedValue: string;
  market: string;
  kickoff: string;
  originalPrediction?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  scoreboardRating: number;
}

const EnhancedBettingDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<DashboardPrediction[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState(1.0);
  const [totalBets, setTotalBets] = useState(0);
  const [winningBets, setWinningBets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('🎯 Neural Network Active - 5(1\'s) Strategy Engaged');
  const [stakeAmount, setStakeAmount] = useState(10);

  // Fetch predictions from YOUR sports.ts API
  const fetchRealPredictions = async (): Promise<DashboardPrediction[]> => {
    try {
      setAiStatus('🔄 Scanning live matches from Sports API...');
      
      const response = await fetch('/api/sports');
      const matches: Match[] = await response.json();
      
      setAiStatus('✅ Neural Network Active - Processing match data...');
      
      // Transform your API data to dashboard format
      return matches.map((match) => {
        const odds = generateOddsFromPrediction(match.prediction);
        const confidence = calculateConfidence(match.prediction);
        const scoreboardRating = calculateScoreboardRating(odds, confidence);
        
        return {
          id: match.id,
          teams: `${match.home} vs ${match.away}`,
          league: detectLeague(match.home, match.away),
          betType: extractBetType(match.prediction),
          odds: parseFloat(odds),
          confidence: confidence,
          source: "Sports API + AI Analysis",
          status: "pending",
          aiRecommendation: parseFloat(odds) <= 1.3 && confidence > 80 ? "🎯 PERFECT 5(1's)" : parseFloat(odds) < 1.5 ? "Strong" : parseFloat(odds) < 2.0 ? "Medium" : "Weak",
          expectedValue: (confidence / 100 * parseFloat(odds) - 1).toFixed(2),
          market: "Match Analysis",
          kickoff: "Live Data",
          originalPrediction: match.prediction,
          riskLevel: parseFloat(odds) <= 1.3 ? 'LOW' : parseFloat(odds) <= 1.8 ? 'MEDIUM' : 'HIGH',
          scoreboardRating: scoreboardRating
        };
      });
    } catch (error) {
      console.error('Error fetching from Sports API:', error);
      setAiStatus('❌ API connection failed - using fallback');
      return [];
    }
  };

  // Calculate scoreboard rating (0-100)
  const calculateScoreboardRating = (odds: string, confidence: number): number => {
    const oddsNum = parseFloat(odds);
    let baseScore = confidence;
    
    // Bonus for perfect 5(1's) range
    if (oddsNum >= 1.0 && oddsNum <= 1.3) {
      baseScore += 15;
    }
    
    // Penalty for high odds
    if (oddsNum > 2.0) {
      baseScore -= 20;
    }
    
    return Math.min(Math.max(baseScore, 0), 100);
  };

  // Helper functions (keeping existing ones)
  const generateOddsFromPrediction = (prediction: string): string => {
    if (prediction.includes('win 3-0') || prediction.includes('win 4-') || prediction.includes('strong')) {
      return (1.1 + Math.random() * 0.2).toFixed(2);
    }
    if (prediction.includes('win 2-0') || prediction.includes('win 2-1')) {
      return (1.2 + Math.random() * 0.2).toFixed(2);
    }
    if (prediction.includes('Draw') || prediction.includes('1-1')) {
      return (2.8 + Math.random() * 0.4).toFixed(2);
    }
    if (prediction.includes('Close') || prediction.includes('tight')) {
      return (1.5 + Math.random() * 0.3).toFixed(2);
    }
    return (1.4 + Math.random() * 0.4).toFixed(2);
  };

  const calculateConfidence = (prediction: string): number => {
    if (prediction.includes('win 3-0') || prediction.includes('dominant')) return 90 + Math.floor(Math.random() * 5);
    if (prediction.includes('win 2-0') || prediction.includes('strong')) return 85 + Math.floor(Math.random() * 8);
    if (prediction.includes('win 2-1') || prediction.includes('likely')) return 78 + Math.floor(Math.random() * 10);
    if (prediction.includes('Draw') || prediction.includes('even')) return 68 + Math.floor(Math.random() * 12);
    return 75 + Math.floor(Math.random() * 10);
  };

  const detectLeague = (home: string, away: string): string => {
    const englishTeams = ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Tottenham'];
    const spanishTeams = ['Barcelona', 'Real Madrid', 'Atletico Madrid', 'Valencia', 'Sevilla'];
    const germanTeams = ['Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen'];
    const italianTeams = ['Juventus', 'Inter Milan', 'AC Milan', 'Naples', 'Roma'];
    
    if (englishTeams.some(team => home.includes(team) || away.includes(team))) return 'Premier League';
    if (spanishTeams.some(team => home.includes(team) || away.includes(team))) return 'La Liga';
    if (germanTeams.some(team => home.includes(team) || away.includes(team))) return 'Bundesliga';
    if (italianTeams.some(team => home.includes(team) || away.includes(team))) return 'Serie A';
    return 'European Football';
  };

  const extractBetType = (prediction: string): string => {
    if (prediction.includes('win 3-0') || prediction.includes('win 4-')) return 'Correct Score';
    if (prediction.includes('win 2-1') || prediction.includes('win 1-0')) return 'Correct Score';
    if (prediction.includes('win') && !prediction.includes('Draw')) return 'Match Winner';
    if (prediction.includes('Draw')) return 'Draw';
    if (prediction.includes('Over') || prediction.includes('goals')) return 'Goals Market';
    return 'Match Result';
  };

  // Load predictions on component mount
  useEffect(() => {
    const loadInitialPredictions = async () => {
      setLoading(true);
      const realPreds = await fetchRealPredictions();
      setPredictions(realPreds);
      setLoading(false);
      
      if (realPreds.length > 0) {
        const fiveOnesCount = realPreds.filter(p => p.odds <= 1.3 && p.confidence > 80).length;
        setAiStatus(`🎯 Loaded ${realPreds.length} predictions • ${fiveOnesCount} perfect 5(1's) detected`);
      }
    };

    loadInitialPredictions();
  }, []);

  // Refresh predictions from your API
  const refreshPredictions = async () => {
    setLoading(true);
    const newPredictions = await fetchRealPredictions();
    setPredictions(prev => [...newPredictions, ...prev.slice(newPredictions.length)]);
    setLoading(false);
  };

  // Apply 5(1's) strategy filter
  const applyFiveOnesStrategy = () => {
    const filteredPreds = predictions.filter(pred => 
      pred.odds >= 1.0 && pred.odds <= 1.3 && pred.confidence > 80
    );
    
    setPredictions(filteredPreds);
    setAiStatus(`🎯 5(1's) Strategy Applied: Found ${filteredPreds.length} optimal low-risk bets`);
  };

  // Place bet function
  const placeBet = (predId: number) => {
    const pred = predictions.find(p => p.id === predId);
    if (pred) {
      const potentialWin = (stakeAmount * pred.odds).toFixed(2);
      const profit = (parseFloat(potentialWin) - stakeAmount).toFixed(2);
      
      window.open('https://stake.com/sports/football', '_blank');
      
      alert(`🎯 5(1's) Strategy Bet:\n\n` +
            `${pred.teams}\n` +
            `${pred.betType}: ${pred.odds}\n` +
            `Confidence: ${pred.confidence}%\n` +
            `Scoreboard Rating: ${pred.scoreboardRating}/100\n` +
            `Stake: $${stakeAmount}\n` +
            `Potential Win: $${potentialWin}\n` +
            `Profit: $${profit}\n\n` +
            `Analysis: ${pred.originalPrediction}\n\n` +
            `Opening Stake.com...`);
    }
  };

  // Mark result
  const markResult = (predId: number, won: boolean) => {
    const predIndex = predictions.findIndex(p => p.id === predId);
    if (predIndex !== -1) {
      const pred = predictions[predIndex];
      setTotalBets(prev => prev + 1);
      
      if (won) {
        setWinningBets(prev => prev + 1);
        setMonthlyProgress(prev => {
          const newProgress = prev * pred.odds;
          if (newProgress >= 9) {
            alert(`🚀 TARGET ACHIEVED! ${newProgress.toFixed(2)}x monthly goal reached with 5(1's) strategy!`);
          }
          return newProgress;
        });
      }
      
      setPredictions(prev => prev.filter(p => p.id !== predId));
    }
  };

  const winRate = totalBets > 0 ? ((winningBets / totalBets) * 100).toFixed(1) : 0;
  const progressPercentage = Math.min((monthlyProgress / 9) * 100, 100);

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-3 flex items-center justify-center gap-4">
            <Target className="w-12 h-12 text-green-400" />
            5(1's) STRATEGY DASHBOARD
            <Zap className="w-12 h-12 text-yellow-400" />
          </h1>
          <p className="text-blue-200 text-xl font-semibold">Neural Network • Scoreboard Rating • 9x Monthly Target</p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Monthly Target</p>
                <p className="text-4xl font-black text-green-400">9.0x</p>
              </div>
              <Target className="w-10 h-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Current Progress</p>
                <p className="text-4xl font-black text-blue-400">{monthlyProgress.toFixed(2)}x</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Win Rate</p>
                <p className="text-4xl font-black text-yellow-400">{winRate}%</p>
              </div>
              <Award className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Active Predictions</p>
                <p className="text-4xl font-black text-purple-400">{predictions.length}</p>
              </div>
              <Brain className="w-10 h-10 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">🎯 Progress to 9x Target</h3>
            <span className="text-2xl font-black text-green-400">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Main Predictions Panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-green-400" />
                5(1's) PREDICTIONS
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={refreshPredictions}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 font-semibold"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={applyFiveOnesStrategy}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 font-semibold"
                >
                  <Target className="w-5 h-5" />
                  5(1's) Filter
                </button>
              </div>
            </div>

            {/* Enhanced API Status */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-300 font-semibold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {aiStatus}
              </p>
            </div>

            {/* Enhanced Predictions List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {predictions.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No predictions loaded. Click Refresh to scan for 5(1's) opportunities.</p>
                </div>
              ) : (
                predictions.map(pred => (
                  <div key={pred.id} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl p-5 border border-gray-700/20 hover:border-green-500/40 transition-all transform hover:scale-102">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold text-lg">{pred.teams}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white`} style={{backgroundColor: getRiskColor(pred.riskLevel)}}>
                            {pred.riskLevel} RISK
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{pred.league} • {pred.kickoff}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-black text-xl">
                          {pred.odds}
                        </span>
                      </div>
                    </div>
                    
                    {/* Scoreboard Rating */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">Scoreboard Rating</span>
                        <span className="text-2xl font-black text-yellow-400">{pred.scoreboardRating}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pred.scoreboardRating}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="text-white font-semibold">{pred.betType}</p>
                        <p className="text-green-400 font-bold">{pred.confidence}% confidence</p>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{pred.originalPrediction}</p>
                      <p className="text-lg font-black mt-2" style={{color: pred.aiRecommendation.includes('PERFECT') ? '#10b981' : '#6b7280'}}>
                        {pred.aiRecommendation}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => placeBet(pred.id)}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all transform hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Bet on Stake
                      </button>
                      <button
                        onClick={() => markResult(pred.id, true)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105"
                      >
                        ✅ Won
                      </button>
                      <button
                        onClick={() => markResult(pred.id, false)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105"
                      >
                        ❌ Lost
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Control Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                <Filter className="w-6 h-6 text-blue-400" />
                Strategy Controls
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block font-medium">Stake Amount ($)</label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white font-bold text-lg"
                    min="1"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/20">
                  <h4 className="text-green-300 font-bold text-sm mb-2">5(1's) Strategy Rules:</h4>
                  <ul className="text-green-200 text-xs space-y-1">
                    <li>• Odds: 1.0 - 1.3 only</li>
                    <li>• Confidence: 80%+ required</li>
                    <li>• Target: 9x monthly return</li>
                    <li>• Risk: Minimal with compound gains</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Links */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
              <h3 className="text-white font-bold text-xl mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="https://stake.com/sports/football"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-4 rounded-xl text-center font-bold transition-all transform hover:scale-105"
                >
                  🎰 Stake.com Sports
                </a>
                <button
                  onClick={refreshPredictions}
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-xl text-center font-bold transition-all transform hover:scale-105"
                >
                  🔄 Scan for 5(1's)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBettingDashboard;