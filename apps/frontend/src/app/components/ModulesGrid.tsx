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

// Loading skeleton component for ModulesGrid
const ModulesGridSkeleton = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideDown">
        <div className="h-8 w-80 bg-gray-700/50 rounded animate-pulse"></div>
        <div className="h-5 w-24 bg-gray-700/50 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-black/80 border border-gray-600/50 rounded-lg p-6 backdrop-blur-sm"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-700/50 rounded-full animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mb-4">
              <div className="h-4 w-full bg-gray-700/50 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-700/50 rounded animate-pulse"></div>
            </div>

            {/* Metrics skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              {Array.from({ length: 3 }).map((_, metricIndex) => (
                <div key={metricIndex} className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Error component
const ModulesGridError = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Mission Control Modules
        </h2>
        <div className="text-sm text-red-400 font-mono">CONNECTION ERROR</div>
      </div>

      <div className="bg-black/80 border border-red-600/50 rounded-lg p-8 text-center backdrop-blur-sm">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-red-400 font-semibold text-lg mb-2">System Offline</h3>
        <p className="text-gray-400 text-sm mb-6">
          Unable to connect to mission control servers: {error}
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={onRetry}
            className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded border border-red-600/50 transition-all duration-300 hover:scale-105"
          >
            Retry Connection
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 text-sm rounded border border-gray-600/50 transition-all duration-300 hover:scale-105"
          >
            Full Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ModulesGrid() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch matches from API with retry logic
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch("/api/sports-proxy", {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      
      const data: Match[] = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      // Map matches to Module format for display
      const mappedModules: Module[] = data.map((match) => ({
        id: String(match.id),
        title: `${match.home} vs ${match.away}`,
        description: match.prediction || 'Prediction analysis in progress...',
        icon: "⚽",
        status: "online",
        metrics: [
          { label: "Home Team", value: match.home },
          { label: "Away Team", value: match.away },
          { label: "Prediction", value: match.prediction || 'TBD' },
        ],
      }));

      setModules(mappedModules);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Failed to fetch modules:', err);
      let errorMessage = 'Unknown error occurred';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout - server not responding';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Auto-retry logic (max 3 times with exponential backoff)
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMatches();
        }, delay);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []); // Remove retryCount dependency to prevent infinite loops

  const handleRetry = () => {
    setRetryCount(0);
    fetchMatches();
  };

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

  // Show loading skeleton
  if (loading && modules.length === 0) {
    return <ModulesGridSkeleton />;
  }

  // Show error state
  if (error && modules.length === 0) {
    return <ModulesGridError error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideDown">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Mission Control Modules
        </h2>
        <div className="flex items-center gap-4">
          {error && (
            <button
              onClick={handleRetry}
              className="text-xs text-yellow-400 hover:text-yellow-300 font-mono"
              title="Retry failed connection"
            >
              🔄 RETRY
            </button>
          )}
          <div className="text-sm text-gray-400 font-mono">
            {modules.filter((m) => m.status === "online").length}/{modules.length} ONLINE
          </div>
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

      {/* Loading indicator for background updates */}
      {loading && modules.length > 0 && (
        <div className="text-center">
          <span className="text-gray-400 text-xs font-mono animate-pulse">
            🔄 Updating mission data...
          </span>
        </div>
      )}
    </div>
  );
}