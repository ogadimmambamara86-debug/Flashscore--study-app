//src/app/components/MagajiCoManger.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Strategic approach ratings inspired by tech titans
interface TechLeaderStrategy {
  name: string;
  avatar: string;
  approach: string;
  efficiency: number;
  innovation: number;
  execution: number;
  riskManagement: number;
  combinedPower: number;
  signature: string;
}

interface PredictionFilter {
  sport: string;
  minOdds: number;
  maxOdds: number;
  confidence: number;
  betType: string;
  amount: number;
  autoConfirm: boolean;
}

interface HumanErrorPrevention {
  id: string;
  originalBet: string;
  correctedBet: string;
  timestamp: Date;
  prevented: boolean;
  reason: string;
}

export default function MagajiCoManager() {
  const [activeStrategy, setActiveStrategy] = useState<string>('bezos');
  const [predictionFilters, setPredictionFilters] = useState<PredictionFilter>({
    sport: 'all',
    minOdds: 1.10,
    maxOdds: 3.00,
    confidence: 75,
    betType: 'all',
    amount: 0,
    autoConfirm: false
  });
  const [errorPrevention, setErrorPrevention] = useState<HumanErrorPrevention[]>([]);
  const [magajiCoActive, setMagajiCoActive] = useState(true);

  const techLeaders: TechLeaderStrategy[] = [
    {
      name: "Jeff Bezos",
      avatar: "👔",
      approach: "Customer-Obsessed Data-Driven",
      efficiency: 95,
      innovation: 85,
      execution: 98,
      riskManagement: 90,
      combinedPower: 92,
      signature: "Day 1 mentality with relentless focus on user experience and long-term thinking"
    },
    {
      name: "Elon Musk",
      avatar: "🚀",
      approach: "First Principles Disruptor",
      efficiency: 88,
      innovation: 99,
      execution: 85,
      riskManagement: 70,
      combinedPower: 85.5,
      signature: "Physics-based thinking with ambitious goals and rapid iteration"
    },
    {
      name: "Jack Ma",
      avatar: "🎯",
      approach: "Ecosystem Builder",
      efficiency: 80,
      innovation: 88,
      execution: 92,
      riskManagement: 85,
      combinedPower: 86.25,
      signature: "Platform thinking with strong execution and customer trust"
    },
    {
      name: "Bill Gates",
      avatar: "💡",
      approach: "Systematic Problem Solver",
      efficiency: 92,
      innovation: 90,
      execution: 88,
      riskManagement: 95,
      combinedPower: 91.25,
      signature: "Methodical approach with focus on scalable solutions and impact"
    },
    {
      name: "Mark Zuckerberg",
      avatar: "🔗",
      approach: "Social Network Effects",
      efficiency: 85,
      innovation: 87,
      execution: 90,
      riskManagement: 75,
      combinedPower: 84.25,
      signature: "Move fast and break things, then connect everyone"
    }
  ];

  const currentLeader = techLeaders.find(leader => leader.name.toLowerCase().includes(activeStrategy)) || techLeaders[0];

  // The 5(1's) Strategy Implementation
  const applyFiveOnesStrategy = (prediction: any) => {
    const strategies = {
      bezos: {
        filter1: "Customer Impact Assessment",
        filter2: "Long-term Value Analysis", 
        filter3: "Data-Driven Validation",
        filter4: "Risk-Reward Optimization",
        filter5: "Execution Excellence Check"
      },
      musk: {
        filter1: "First Principles Breakdown",
        filter2: "Innovation Potential",
        filter3: "Disruption Capability", 
        filter4: "Technical Feasibility",
        filter5: "Mars-Shot Ambition"
      },
      ma: {
        filter1: "Ecosystem Synergy",
        filter2: "Trust & Reputation",
        filter3: "Platform Network Effects",
        filter4: "SME Empowerment",
        filter5: "Sustainable Growth"
      },
      gates: {
        filter1: "Problem Definition Clarity",
        filter2: "Solution Scalability",
        filter3: "Systematic Approach",
        filter4: "Measurable Impact",
        filter5: "Resource Optimization"
      },
      zuckerberg: {
        filter1: "Social Connection Value",
        filter2: "Viral Potential",
        filter3: "User Engagement",
        filter4: "Network Growth",
        filter5: "Platform Integration"
      }
    };

    return strategies[activeStrategy as keyof typeof strategies] || strategies.bezos;
  };

  // Human Error Prevention System
  const preventHumanError = (originalBet: string, suggestedBet: string) => {
    const errorCheck: HumanErrorPrevention = {
      id: Date.now().toString(),
      originalBet,
      correctedBet: suggestedBet,
      timestamp: new Date(),
      prevented: true,
      reason: "MagajiCo detected potential betting error similar to Fernabache incident"
    };

    setErrorPrevention(prev => [errorCheck, ...prev.slice(0, 9)]);
    return errorCheck;
  };

  // Fernabache Case Study Prevention
  const fernabachePrevention = () => {
    return {
      scenario: "Fernabache Over 1.5 @1.16 vs Straight Win @1.31",
      issue: "Quick decision change without proper validation",
      solution: "MagajiCo 5(1's) filter system prevents hasty changes",
      implementation: "Mandatory cooling period + confirmation dialog + bet comparison"
    };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          MagajiCo AI Manager
        </h1>
        <p className="text-gray-300 mt-2">Tech Titan-Inspired Prediction Management System</p>
      </div>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {techLeaders.map((leader, index) => (
          <div
            key={index}
            onClick={() => setActiveStrategy(leader.name.toLowerCase().split(' ')[0])}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              activeStrategy === leader.name.toLowerCase().split(' ')[0]
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{leader.avatar}</div>
              <h3 className="font-bold text-sm">{leader.name}</h3>
              <div className="text-xs text-gray-300 mt-1">Power: {leader.combinedPower}%</div>
              <div className="mt-2 space-y-1">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${leader.efficiency}%` }}
                  ></div>
                </div>
                <div className="text-xs">Efficiency</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Strategy Display */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {currentLeader.avatar} {currentLeader.name}'s Strategy
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{currentLeader.combinedPower}%</div>
            <div className="text-sm text-gray-400">Combined Power</div>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">{currentLeader.signature}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{currentLeader.efficiency}%</div>
            <div className="text-sm">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">{currentLeader.innovation}%</div>
            <div className="text-sm">Innovation</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{currentLeader.execution}%</div>
            <div className="text-sm">Execution</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{currentLeader.riskManagement}%</div>
            <div className="text-sm">Risk Mgmt</div>
          </div>
        </div>
      </div>

      {/* 5(1's) Filter System */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">🔍 5(1's) Strategy Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(applyFiveOnesStrategy({})).map(([key, value], index) => (
            <div key={key} className="bg-gray-700 p-3 rounded-lg">
              <div className="font-bold text-sm text-yellow-400">Filter {index + 1}</div>
              <div className="text-xs mt-1">{value}</div>
              <div className="mt-2">
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">⚙️ Smart Prediction Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sport</label>
            <select 
              className="w-full p-2 bg-gray-700 rounded"
              value={predictionFilters.sport}
              onChange={(e) => setPredictionFilters(prev => ({ ...prev, sport: e.target.value }))}
            >
              <option value="all">All Sports</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Odds</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 bg-gray-700 rounded"
              value={predictionFilters.minOdds}
              onChange={(e) => setPredictionFilters(prev => ({ ...prev, minOdds: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Odds</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 bg-gray-700 rounded"
              value={predictionFilters.maxOdds}
              onChange={(e) => setPredictionFilters(prev => ({ ...prev, maxOdds: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Confidence %</label>
            <input
              type="number"
              className="w-full p-2 bg-gray-700 rounded"
              value={predictionFilters.confidence}
              onChange={(e) => setPredictionFilters(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      </div>

      {/* Fernabache Case Study */}
      <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-red-400">🚨 Fernabache Incident Prevention</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-2">The Mistake:</h4>
            <p className="text-sm text-gray-300">
              "Put Fernabache over 1.5 @odd 1.16 but immediately I saw increase odd at straight win 1.31 
              I quick forgot that I even wrote it down to play ov 1.5."
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-green-400">MagajiCo Solution:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✅ Mandatory 30-second cooling period</li>
              <li>✅ Bet confirmation with original vs new comparison</li>
              <li>✅ Auto-save all written predictions</li>
              <li>✅ Visual warnings for quick bet changes</li>
              <li>✅ Strategy consistency checker</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Prevention Log */}
      {errorPrevention.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">🛡️ Error Prevention Log</h3>
          <div className="space-y-3">
            {errorPrevention.map((error) => (
              <div key={error.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">Prevented: {error.originalBet} → {error.correctedBet}</div>
                  <div className="text-xs text-gray-400">{error.reason}</div>
                </div>
                <div className="text-green-400 text-sm">
                  {error.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MagajiCo Status */}
      <div className="fixed bottom-4 right-4">
        <div className={`p-4 rounded-full shadow-lg ${magajiCoActive ? 'bg-green-600' : 'bg-red-600'}`}>
          <div className="text-center">
            <div className="text-2xl">🤖</div>
            <div className="text-xs font-bold">MagajiCo</div>
            <div className="text-xs">{magajiCoActive ? 'ACTIVE' : 'OFFLINE'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
