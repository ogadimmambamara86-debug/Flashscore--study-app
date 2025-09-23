"use client";
import React, { useState } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";

export default function MagajiCoManager() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Simulate AI Prediction
  const runPrediction = () => {
    // Simulate async prediction
    triggerFloatingAlert("🤖 Running AI prediction...", "info");
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        triggerFloatingAlert("✅ Prediction completed successfully!", "success");
      } else {
        triggerFloatingAlert("❌ Prediction failed! Try again.", "error");
      }
    }, 1500);
  };

  // Simulate Strategy Trigger
  const applyStrategy = () => {
    triggerFloatingAlert("⚡ Applying strategy filters...", "warning", true);
    setTimeout(() => {
      triggerFloatingAlert("✅ Strategy applied successfully!", "success");
    }, 1200);
  };

  // Simulate Human Error Prevention
  const preventError = () => {
    triggerFloatingAlert("🛡️ Checking for human error...", "info");
    setTimeout(() => {
      triggerFloatingAlert("✅ No conflicts detected.", "success");
    }, 1000);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">MagajiCo Manager</h1>

      <div className="space-x-2">
        <button
          onClick={runPrediction}
          className="p-2 bg-blue-600 text-white rounded"
        >
          Run AI Prediction
        </button>

        <button
          onClick={applyStrategy}
          className="p-2 bg-yellow-500 text-white rounded"
        >
          Apply Strategy
        </button>

        <button
          onClick={preventError}
          className="p-2 bg-red-500 text-white rounded"
        >
          Check Human Error
        </button>
      </div>

      {/* Floating Alerts Panel */}
      <FloatingAlert enabled={alertsEnabled} onToggle={setAlertsEnabled} />
    </div>
  );
}