
"use client";
import React from "react";

export default function MissionBriefing() {
  return (
    <div className="glass-card p-6 mb-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/30 rounded-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          🏆 Sports Central Mission Control
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
          Welcome to the ultimate sports prediction platform! Get AI-powered insights, participate in interactive quizzes, 
          connect with fellow sports enthusiasts, and earn Pi coins for your engagement. 
          Your mission: Make smarter predictions, build your reputation, and climb the leaderboards!
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">🔮</span>
            <span className="text-gray-300">AI Predictions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🪙</span>
            <span className="text-gray-300">Pi Rewards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">🎯</span>
            <span className="text-gray-300">Interactive Quizzes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">💬</span>
            <span className="text-gray-300">Community Forum</span>
          </div>
        </div>
      </div>
    </div>
  );
}
