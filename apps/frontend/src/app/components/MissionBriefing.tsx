
"use client";
import React, { useState, useEffect } from "react";

const MissionBriefing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { label: "Accuracy Rate", value: "94.2%", icon: "🎯", color: "#22c55e" },
    { label: "Active Users", value: "1,247", icon: "👥", color: "#06b6d4" },
    { label: "Predictions Made", value: "15,892", icon: "🔮", color: "#8b5cf6" },
    { label: "Total Winnings", value: "$2.1M", icon: "💰", color: "#f59e0b" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mx-4 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="glass-card p-6 hover-lift">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            🚀 Mission Control Dashboard
          </h2>
          <p className="text-gray-300 text-lg">
            Your gateway to winning sports predictions powered by advanced AI
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`glass-card p-4 text-center transition-all duration-500 hover-glow ${
                activeMetric === index ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''
              }`}
              style={{
                background: activeMetric === index 
                  ? `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`
                  : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="text-2xl mb-2 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                🤖
              </div>
              <h3 className="font-semibold text-white">AI Predictions</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Advanced machine learning algorithms analyze thousands of data points for accurate predictions
            </p>
          </div>

          <div className="glass-card p-4 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                📊
              </div>
              <h3 className="font-semibold text-white">Live Analytics</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Real-time sports data and statistics updated every second for maximum accuracy
            </p>
          </div>

          <div className="glass-card p-4 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                🪙
              </div>
              <h3 className="font-semibold text-white">Earn Pi Coins</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Complete challenges, make predictions, and earn Pi coins for exclusive rewards
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-card p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30">
            <h3 className="text-xl font-bold text-white mb-2">
              🎯 Ready to Start Winning?
            </h3>
            <p className="text-cyan-200 mb-4">
              Join thousands of successful sports bettors using our AI-powered platform
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>✅</span>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <span>✅</span>
                <span>π50 welcome bonus</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <span>✅</span>
                <span>94%+ accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;
