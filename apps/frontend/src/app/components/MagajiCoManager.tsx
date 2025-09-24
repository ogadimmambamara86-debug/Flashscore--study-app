"use client";
import React, { useEffect, useState } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";
import { magajicoCEO, Prediction, CEOAction } from "./ai/magajicoCEO";

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

  // CEO reviews predictions whenever they update
  useEffect(() => {
    if (predictions.length > 0) {
      const decisions: CEOAction[] = magajicoCEO(predictions);
      decisions.forEach((action) => {
        if (action.type === "ALERT") {
          triggerFloatingAlert(action.message, action.level);
        }
        if (action.type === "HIGHLIGHT") {
          window.dispatchEvent(new CustomEvent("highlightMatch", { detail: action.match }));
        }
      });
    }
  }, [predictions]);

  return (
    <div className="p-4 bg-slate-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">MagajiCo Manager (COO)</h2>
      <button
        className="px-4 py-2 bg-green-600 rounded"
        onClick={fetchPredictions}
      >
        🔍 Fetch Predictions (On-Demand)
      </button>
      <FloatingAlert enabled={true} onToggle={() => {}} />
    </div>
  );
}