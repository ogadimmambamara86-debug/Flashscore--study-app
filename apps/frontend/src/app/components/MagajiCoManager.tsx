"use client";
import React, { useEffect, useState } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";
import { magajicoCEO, Prediction, CEOAction, getStrategicInsights } from "./ai/magajicoCEO";

export default function MagajiCoManager() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

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
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🧠 MagajiCo Strategic AI (CEO)
        </h2>
      </div>
      
      {strategicInsights && (
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-blue-600/20 p-3 rounded-lg">
            <div className="font-semibold text-blue-300">Market Opportunities</div>
            <div className="text-2xl font-bold">{strategicInsights.totalOpportunities}</div>
          </div>
          <div className="bg-purple-600/20 p-3 rounded-lg">
            <div className="font-semibold text-purple-300">Innovation Index</div>
            <div className="text-2xl font-bold">{strategicInsights.innovationIndex}%</div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
          onClick={fetchPredictions}
        >
          🚀 Execute Strategic Analysis
        </button>
        
        <div className="px-4 py-3 bg-slate-700 rounded-lg text-sm">
          <span className="text-slate-400">Predictions: </span>
          <span className="font-bold text-green-400">{predictions.length}</span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-400">
        Strategic Intelligence: Musk Innovation • Gates Market Positioning • Bezos Long-term • Ma Risk Management
      </div>
      
      <FloatingAlert enabled={true} onToggle={() => {}} />
    </div>
  );
}