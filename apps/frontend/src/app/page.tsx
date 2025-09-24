"use client";

import SystemStatus from "./components/SystemStatus";
import QuickActions from "./components/QuickActions";
import PredictionsPreview from "./components/PredictionsPreview";
import { useBackendHealth } from "./hooks/useBackendHealth";
import { usePredictions } from "./hooks/usePredictions";

export default function HomePage() {
  const backendStatus = useBackendHealth();
  const predictions = usePredictions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-5 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl mb-2">⚽ MagajiCo</h1>
        <p className="text-lg opacity-90">Smart Football Predictions Platform</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-5 grid-cols-1 md:grid-cols-2">
        <SystemStatus backendStatus={backendStatus} />
        <QuickActions />
        <PredictionsPreview predictions={predictions} />
      </div>

      <footer className="text-center mt-10 opacity-70">
        <p>🏆 Powered by MagajiCo Technology | Next.js + Fastify + FastAPI</p>
      </footer>
    </div>
  );
}