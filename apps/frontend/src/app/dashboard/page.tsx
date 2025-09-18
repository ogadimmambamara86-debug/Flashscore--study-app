"use client";
import React, { useState, useEffect } from "react";
import {
  Filter, TrendingUp, Target, Shield, RefreshCw,
  Lock, Unlock, AlertTriangle, CheckCircle, XCircle, Sliders
} from "lucide-react";

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
  odds: number;
  confidence: number;
  league: string;
  kickoff: string;
}

interface SystemSettings {
  maxOdds: number;
  minConfidence: number;
  maxDailyBets: number;
  currentDailyCount: number;
  systemLocked: boolean;
}

interface DailyStats {
  betsPlaced: number;
  systemFollowed: number;
  emotionalDeviations: number;
  profitLoss: number;
}

const SystematicDashboard: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maxOdds: 1.3,
    minConfidence: 80,
    maxDailyBets: 5,
    currentDailyCount: 0,
    systemLocked: false,
  });
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    betsPlaced: 0,
    systemFollowed: 0,
    emotionalDeviations: 0,
    profitLoss: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterMode, setFilterMode] = useState<"system" | "all">("system");

  // Generate sample matches
  const generateMatches = (): Match[] => {
    const sampleMatches = [
      { home: "Manchester City", away: "Brighton", league: "Premier League" },
      { home: "Barcelona", away: "Getafe", league: "La Liga" },
      { home: "Bayern Munich", away: "Augsburg", league: "Bundesliga" },
      { home: "PSG", away: "Montpellier", league: "Ligue 1" },
      { home: "Liverpool", away: "Crystal Palace", league: "Premier League" },
      { home: "Real Madrid", away: "Cadiz", league: "La Liga" },
      { home: "Inter Milan", away: "Empoli", league: "Serie A" },
      { home: "Arsenal", away: "Sheffield United", league: "Premier League" },
    ];

    return sampleMatches.map((match, index) => ({
      id: index + 1,
      home: match.home,
      away: match.away,
      prediction: `${match.home} to win`,
      odds: parseFloat((1.05 + Math.random() * 0.8).toFixed(2)),
      confidence: 60 + Math.floor(Math.random() * 35),
      league: match.league,
      kickoff: `${14 + Math.floor(Math.random() * 6)}:${Math.floor(Math.random() * 4) * 15}`,
    }));
  };

  const systemMatches = matches.filter(
    (m) => m.odds <= systemSettings.maxOdds && m.confidence >= systemSettings.minConfidence
  );

  const highReturnMatches = matches.filter(
    (m) => m.odds > systemSettings.maxOdds || m.confidence < systemSettings.minConfidence
  );

  useEffect(() => {
    refreshMatches();
  }, []);

  // --- HANDLERS ---
  const toggleSystemLock = () => {
    setSystemSettings((prev) => ({
      ...prev,
      systemLocked: !prev.systemLocked,
    }));
  };

  const updateSystemSetting = (key: keyof SystemSettings, value: number) => {
    if (!systemSettings.systemLocked) {
      setSystemSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const refreshMatches = () => {
    setLoading(true);
    setTimeout(() => {
      setMatches(generateMatches());
      setLoading(false);
    }, 1000);
  };

  const canPlaceBet = systemSettings.currentDailyCount < systemSettings.maxDailyBets;

  // --- Place Bet Handler ---
  const placeBet = (match: Match, isSystem: boolean) => {
    if (!canPlaceBet || systemSettings.systemLocked) return;

    setSystemSettings((prev) => ({
      ...prev,
      currentDailyCount: prev.currentDailyCount + 1,
    }));

    setDailyStats((prev) => ({
      ...prev,
      betsPlaced: prev.betsPlaced + 1,
      systemFollowed: prev.systemFollowed + (isSystem ? 1 : 0),
      emotionalDeviations: prev.emotionalDeviations + (isSystem ? 0 : 1),
      profitLoss: parseFloat((prev.profitLoss + (Math.random() > 0.5 ? 5 : -5)).toFixed(2)), // simulate win/loss
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4">

        {/* HEADER */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  canPlaceBet ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              />
              <h1 className="text-3xl font-bold">System Dashboard</h1>
              <span className="text-sm bg-blue-500/20 px-3 py-1 rounded-full">
                {systemSettings.currentDailyCount}/{systemSettings.maxDailyBets} Today
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSystemLock}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  systemSettings.systemLocked
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-green-500/20 text-green-400 border border-green-500/50"
                }`}
              >
                {systemSettings.systemLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {systemSettings.systemLocked ? "Locked" : "Unlocked"}
              </button>

              <button
                onClick={refreshMatches}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterMode("system")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              filterMode === "system"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            System Matches ({systemMatches.length})
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              filterMode === "all"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Matches ({matches.length})
          </button>
        </div>

        {/* MATCHES DISPLAY */}
        <div className="space-y-4">
          {(filterMode === "system" || filterMode === "all") &&
            systemMatches.length > 0 && (
              <div className="bg-green-900/20 backdrop-blur-xl rounded-2xl border border-green-500/30">
                <div className="p-4 border-b border-green-500/20 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-green-400">System Approved Matches</h3>
                </div>
                <div className="p-4 space-y-3">
                  {systemMatches.map((match) => (
                    <div key={match.id} className="bg-black/30 rounded-xl p-4 border border-green-500/20 flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{match.home} vs {match.away}</h4>
                        <p className="text-sm text-gray-400">{match.league} • {match.kickoff}</p>
                        <div className="text-sm text-gray-400">{match.confidence}% confidence</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">{match.odds}</div>
                        <button
                          onClick={() => placeBet(match, true)}
                          disabled={!canPlaceBet || systemSettings.systemLocked}
                          className="mt-2 px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm"
                        >
                          Place Bet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {filterMode === "all" && highReturnMatches.length > 0 && (
            <div className="bg-red-900/20 backdrop-blur-xl rounded-2xl border border-red-500/30">
              <div className="p-4 border-b border-red-500/20 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-400">Outside Parameters</h3>
              </div>
              <div className="p-4 space-y-3">
                {highReturnMatches.map((match) => (
                  <div key={match.id} className="bg-black/30 rounded-xl p-4 border border-red-500/20 flex justify-between items-center opacity-70">
                    <div>
                      <h4 className="text-white font-medium">{match.home} vs {match.away}</h4>
                      <p className="text-sm text-gray-400">{match.league} • {match.kickoff}</p>
                      <div className="text-xs text-red-400 mt-1">
                        {match.odds > systemSettings.maxOdds && `Odds too high (${match.odds}) `}
                        {match.confidence < systemSettings.minConfidence && `Confidence too low (${match.confidence}%)`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-400">{match.odds}</div>
                      <button
                        onClick={() => placeBet(match, false)}
                        disabled={!canPlaceBet || systemSettings.systemLocked}
                        className="mt-2 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm"
                      >
                        Place Bet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SystematicDashboard;