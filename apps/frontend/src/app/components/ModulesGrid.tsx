import React, { useState, useEffect } from 'react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  controller?: string;
  metrics?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

interface ModulesGridProps {
  isLoading?: boolean;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({ isLoading = false }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const modules: Module[] = [
    {
      id: 'launch-tracker',
      title: 'Launch Tracker',
      description: 'Real-time SpaceX launch monitoring and countdown systems',
      icon: '🚀',
      status: 'online',
      controller: '@controllers/LaunchController',
      metrics: [
        { label: 'Next Launch', value: 'T-2:14:33', trend: 'stable' },
        { label: 'Success Rate', value: '94.7%', trend: 'up' },
        { label: 'Active Missions', value: '3', trend: 'stable' }
      ]
    },
    {
      id: 'odds-calculator',
      title: 'Odds Calculator',
      description: 'Advanced betting odds computation and risk analysis engine',
      icon: '🎯',
      status: 'online',
      controller: '@controllers/OddsController',
      metrics: [
        { label: 'Live Markets', value: '47', trend: 'up' },
        { label: 'Accuracy', value: '89.3%', trend: 'up' },
        { label: 'Volume', value: '$2.4M', trend: 'up' }
      ]
    },
    {
      id: 'market-analyzer',
      title: 'Market Analyzer',
      description: 'Multi-platform betting market comparison and arbitrage detection',
      icon: '📊',
      status: 'warning',
      controller: '@controllers/MarketController',
      metrics: [
        { label: 'Exchanges', value: '12', trend: 'stable' },
        { label: 'Arbitrage Ops', value: '7', trend: 'down' },
        { label: 'Profit Margin', value: '3.2%', trend: 'stable' }
      ]
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Portfolio risk assessment and automated safety protocols',
      icon: '🛡️',
      status: 'online',
      controller: '@controllers/RiskController',
      metrics: [
        { label: 'Risk Score', value: 'LOW', trend: 'stable' },
        { label: 'Exposure', value: '15.2%', trend: 'down' },
        { label: 'Safety Net', value: 'ACTIVE', trend: 'stable' }
      ]
    },
    {
      id: 'notification-hub',
      title: 'Notification Hub',
      description: 'Smart alerts and communication system for critical events',
      icon: '🔔',
      status: 'online',
      controller: '@controllers/NotificationController',
      metrics: [
        { label: 'Active Alerts', value: '3', trend: 'stable' },
        { label: 'Response Time', value: '0.8s', trend: 'up' },
        { label: 'Delivery Rate', value: '99.1%', trend: 'stable' }
      ]
    },
    {
      id: 'data-collector',
      title: 'Data Collector',
      description: 'High-frequency data ingestion from multiple SpaceX and betting sources',
      icon: '📡',
      status: 'maintenance',
      controller: '@controllers/DataController',
      metrics: [
        { label: 'Sources', value: '28', trend: 'stable' },
        { label: 'Updates/min', value: '1,247', trend: 'up' },
        { label: 'Latency', value: '12ms', trend: 'up' }
      ]
    }
  ];

  useEffect(() => {
    if (isLoading) return;
    
    // Simulate progressive module loading
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setModulesLoaded(true), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(progressTimer);
  }, [isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'maintenance': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'OPERATIONAL';
      case 'warning': return 'WARNING';
      case 'maintenance': return 'MAINTENANCE';
      default: return 'OFFLINE';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➖';
    }
  };

  // Loading Skeleton for individual module cards
  const ModuleSkeleton = ({ index }: { index: number }) => (
    <div 
      className={`bg-black/80 border border-gray-600/30 rounded-lg p-6 backdrop-blur-sm animate-pulse`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-600/30 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-5 w-32 bg-gray-600/30 rounded mb-2 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-600/30 animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-600/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4 w-full bg-gray-600/20 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-3/4 bg-gray-600/20 rounded mb-4 animate-pulse"></div>

      <div className="h-6 w-full bg-cyan-600/10 rounded mb-4 animate-pulse"></div>

      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-600/30 rounded mb-2 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-20 bg-gray-600/20 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-600/20 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Main loading state with progress
  if (isLoading || !modulesLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-600/30 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-600/20 rounded animate-pulse"></div>
        </div>

        {/* Loading Progress Bar */}
        <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-400 text-sm font-mono">Initializing Mission Modules...</span>
            <span className="text-cyan-400 text-sm font-mono">{Math.round(loadingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2 font-mono">
            {loadingProgress < 30 && "Connecting to launch systems..."}
            {loadingProgress >= 30 && loadingProgress < 60 && "Loading betting analytics..."}
            {loadingProgress >= 60 && loadingProgress < 90 && "Synchronizing data feeds..."}
            {loadingProgress >= 90 && "Finalizing module initialization..."}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <ModuleSkeleton key={index} index={index} />
          ))}
        </div>

        <div className="bg-black/80 border border-gray-600/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-5 w-32 bg-gray-600/30 rounded animate-pulse"></div>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-600/30 animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-600/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-3 w-24 bg-gray-600/20 rounded animate-pulse"></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideDown">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Mission Control Modules
        </h2>
        <div className="text-sm text-gray-400 font-mono">
          {modules.filter(m => m.status === 'online').length}/{modules.length} ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`bg-black/80 border rounded-lg p-6 transition-all duration-500 cursor-pointer hover:scale-105 backdrop-blur-sm animate-slideUp ${
              selectedModule === module.id 
                ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' 
                : 'border-gray-600/50 hover:border-gray-500'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-bounce" style={{ animationDelay: `${index * 200 + 500}ms` }}>
                  {module.icon}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: getStatusColor(module.status),
                        animationDelay: `${index * 100}ms`
                      }}
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
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {module.description}
            </p>

            {/* Controller Info */}
            {module.controller && (
              <div className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-600/30 animate-fadeIn" 
                   style={{ animationDelay: `${index * 100 + 800}ms` }}>
                {module.controller}
              </div>
            )}

            {/* Metrics */}
            {module.metrics && (
              <div className="space-y-2">
                <h4 className="text-white text-sm font-semibold">Real-time Metrics</h4>
                {module.metrics.map((metric, metricIndex) => (
                  <div 
                    key={metricIndex} 
                    className="flex items-center justify-between text-xs animate-fadeIn"
                    style={{ animationDelay: `${index * 100 + metricIndex * 200 + 1000}ms` }}
                  >
                    <span className="text-gray-400">{metric.label}:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-mono">{metric.value}</span>
                      {metric.trend && (
                        <span title={`Trend: ${metric.trend}`} className="animate-pulse">
                          {getTrendIcon(metric.trend)}
                        </span>
                      )}
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

      {/* System Status Bar */}
      <div className="bg-black/90 border border-gray-600/50 rounded-lg p-4 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '1200ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">System Status:</span>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-400">Core Systems</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-gray-400">Market Analysis</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-gray-400">Data Collection</span>
              </span>
            </div>
          </div>
          <div className="text-