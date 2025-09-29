"use client";

import { useState, useEffect } from "react";
import MagajiCoManager from "./components/MagajiCoManager";
import NewsAuthorManager from "./components/NewsAuthorManager";

export default function HomePage() {
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [error, setError] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    fetch("/api/backend/health")
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(() => {
        setLoadingPredictions(false);
        setError(false);
        setBackendStatus("✅ Connected");
      })
      .catch(() => {
        setLoadingPredictions(false);
        setError(true);
        setBackendStatus("❌ Disconnected");
      });
  }, []);

  // 🔑 Secret keyboard shortcut: Shift + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "d") {
        setDevMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-5 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl mb-2">⚽ MagajiCo</h1>
        <p className="text-lg opacity-90">Smart Football Predictions Platform</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-5 grid-cols-1 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">
            View Predictions
          </button>

          {/* Dev Mode button only in dev */}
          {process.env.NODE_ENV === "development" && (
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={() => setDevMode(!devMode)}
            >
              {devMode ? "Hide Dev Mode" : "Dev Mode"}
            </button>
          )}
        </div>

        {/* Welcome + Dynamic Messages */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Welcome to MagajiCo</h2>
          {loadingPredictions && <p>⏳ Loading predictions, please wait...</p>}
          {!loadingPredictions && !error && (
            <p>
              ✅ Predictions are ready! Explore matches and smart insights powered by MagajiCo.
            </p>
          )}
          {!loadingPredictions && error && (
            <p className="text-red-400">
              ❌ Oops! We couldn’t fetch predictions right now. Please try again later.
            </p>
          )}

          {/* 🔧 Developer-only system info */}
          {devMode && (
            <div className="mt-4 text-sm opacity-80">
              <p>🔧 Backend Status: {backendStatus}</p>
              <p>🔧 Frontend Status: ✅ Running</p>
              <p>🔧 Mode: {process.env.NODE_ENV}</p>
            </div>
          )}
        </div>

        {/* News Authors Management Section */}
        <div className="md:col-span-2">
          <NewsAuthorManager />
        </div>
      </div>

      <footer className="text-center mt-10 opacity-70">
        <p>🏆 Powered by MagajiCo Technology | Next.js + Fastify</p>
      </footer>

      <MagajiCoManager />
    </div>
  );
}