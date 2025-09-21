"use client";

import React, { useState, useEffect } from "react";

// Types
interface Metric {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "online" | "offline" | "maintenance" | "warning";
  metrics?: Metric[];
}

// Live match type from API
interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

export default function ModulesGrid() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches from API
  useEffect(() => {
    let isMounted = true;
    
    async function fetchMatches() {
      try {
        const res = await fetch("/api/sports-proxy");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data: Match[] = await res.json();

        if (isMounted) {
          // Map matches to Module format for display
          const mappedModules: Module[] = data.map((match) => ({
            id: String(match.id),
            title: `${match.home} vs ${match.away}`,
            description: match.prediction,
            icon: "⚽", // generic football icon, can customize
            status: "online",
            metrics: [
              { label: "Home Team", value: match.home },
              { label: "Away Team", value: match.away },
              { label: "Prediction", value: match.prediction },
            ],
          }));

          setModules(mappedModules);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(err);
          setError(err.message || "Failed to fetch modules");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMatches();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e";
      case "warning":
        return "#f59e0b";
      case "maintenance":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "OPERATIONAL";
      case "warning":
        return "WARNING";
      case "maintenance":
        return "MAINTENANCE";
      default:
        return "OFFLINE";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➖";
    }
  };

  if (loading) return <div className="text-white">Loading modules...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideDown">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Sports Central Modules
        </h2>
        <div className="text-sm text-gray-400 font-mono">
          {modules.filter((m) => m.status === "online").length}/{modules.length} ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`bg-black/80 border rounded-lg p-6 transition-all duration-500 cursor-pointer hover:scale-105 backdrop-blur-sm animate-slideUp ${
              selectedModule === module.id
                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                : "border-gray-600/50 hover:border-gray-500"
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-bounce">{module.icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-lg leading-tight">{module.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: getStatusColor(module.status) }}
                    ></div>
                    <span
                      className="text-xs font-mono uppercase font-bold"
                      style={{ color: getStatusColor(module.status) }}
                    >
                      {getStatusText(module.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{module.description}</p>

            {/* Metrics */}
            {module.metrics && (
              <div className="space-y-2">
                <h4 className="text-white text-sm font-semibold">Real-time Metrics</h4>
                {module.metrics.map((metric, metricIndex) => (
                  <div
                    key={metricIndex}
                    className="flex items-center justify-between text-xs animate-fadeIn"
                  >
                    <span className="text-gray-400">{metric.label}:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-mono">{metric.value}</span>
                      {metric.trend && <span title={`Trend: ${metric.trend}`}>{getTrendIcon(metric.trend)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Expanded View */}
            {selectedModule === module.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 animate-slideDown">
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs rounded border border-cyan-600/50 transition-all duration-300 hover:scale-105">
                    Configure
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs rounded border border-green-600/50 transition-all duration-300 hover:scale-105">
                    Launch
                  </button>
                  <button className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 text-xs rounded border border-gray-600/50 transition-all duration-300 hover:scale-105">
                    Logs
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}