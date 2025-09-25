
"use client";
import React, { useEffect, useState } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";
import { magajicoCEO, Prediction, CEOAction, getStrategicInsights } from "./ai/magajicoCEO";

interface MagajiCoManagerProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function MagajiCoManager({ isOpen = false, onToggle }: MagajiCoManagerProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isMinimized, setIsMinimized] = useState(!isOpen);

  // Fetch predictions from backend
  const fetchPredictions = async () => {
    try {
      const res = await fetch("/api/backend/predictions");
      const data = await res.json();
      setPredictions(data.data || []);
    } catch (err) {
      triggerFloatingAlert("❌ Failed to fetch predictions", "danger");
    }
  };

  // Autonomous CEO thinking
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  // CEO reviews predictions whenever they update with strategic intelligence
  useEffect(() => {
    if (predictions.length > 0) {
      const decisions: CEOAction[] = magajicoCEO(predictions);
      const insights = getStrategicInsights(predictions);
      
      decisions.forEach((action) => {
        if (action.type === "ALERT") {
          triggerFloatingAlert(action.message, action.level);
        }
        if (action.type === "HIGHLIGHT") {
          window.dispatchEvent(new CustomEvent("highlightMatch", { detail: action.match }));
        }
        if (action.type === "STRATEGIC_MOVE") {
          triggerFloatingAlert(`🧠 Strategic Decision: ${action.action} - ${action.reasoning}`, "info");
        }
        if (action.type === "MARKET_OPPORTUNITY") {
          triggerFloatingAlert(`💎 Market Opportunity: ${action.prediction.match} - ${action.potential}% potential`, "success");
        }
      });
      
      // Display strategic insights
      if (insights.totalOpportunities > 0) {
        setTimeout(() => {
          triggerFloatingAlert(
            `📊 Strategic Intel: ${insights.totalOpportunities} opportunities | Innovation: ${insights.innovationIndex}% | Risk Management: ${insights.riskManagementScore}%`, 
            "info"
          );
        }, 2000);
      }
    }
  }, [predictions]);

  const strategicInsights = predictions.length > 0 ? getStrategicInsights(predictions) : null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isMinimized ? '🧠' : '✕'}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl border-l border-slate-700 transform transition-transform duration-300 z-40 ${
          isMinimized ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🧠 MagajiCo Strategic AI (CEO)
            </h2>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {strategicInsights && (
            <div className="grid grid-cols-1 gap-4 mb-6 text-sm">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <div className="font-semibold text-blue-300">Market Opportunities</div>
                <div className="text-2xl font-bold">{strategicInsights.totalOpportunities}</div>
                <div className="text-xs text-blue-200">5(1) Filter: {strategicInsights.filter5Score}%</div>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <div className="font-semibold text-purple-300">Meta Intelligence</div>
                <div className="text-2xl font-bold">{strategicInsights.metaIntelligence}%</div>
                <div className="text-xs text-purple-200">Zuckerberg: {strategicInsights.zuckerbergStrategy}</div>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <div className="font-semibold text-green-300">AI Predictions</div>
                <div className="text-2xl font-bold">{predictions.length}</div>
                <div className="text-xs text-green-200">ML Backend Active</div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
              onClick={fetchPredictions}
            >
              🚀 Execute Strategic Analysis
            </button>
            
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
              onClick={() => triggerFloatingAlert("🤖 ML Backend Processing...", "info")}
            >
              🤖 Run ML Predictions
            </button>
            
            <div className="px-4 py-3 bg-slate-700 rounded-lg text-sm text-center">
              <span className="text-slate-400">Predictions: </span>
              <span className="font-bold text-green-400">{predictions.length}</span>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-slate-400 space-y-2">
            <div>Strategic Intelligence: Musk Innovation • Gates Market Positioning • Bezos Long-term • Ma Risk Management • Zuckerberg Meta Strategy</div>
            <div className="text-blue-400">🌐 MagajiCo 5(1) Filter: 5 Quality Checks → 1 Strategic Decision | Meta Intelligence Active</div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {!isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMinimized(true)}
        />
      )}
      
      <FloatingAlert enabled={true} onToggle={() => {}} />
    </>
  );
}
