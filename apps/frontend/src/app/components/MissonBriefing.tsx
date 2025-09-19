"use client";
import React, { useState, useEffect } from 'react';

interface MissionBriefingProps {
  isLoading?: boolean;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ isLoading = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionStatus, setMissionStatus] = useState<'standby' | 'active' | 'critical'>('standby');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initialization delay
    const initTimer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(initTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      timeZoneName: 'short'
    });
  };

  const getStatusColor = () => {
    switch (missionStatus) {
      case 'active': return '#22c55e';
      case 'critical': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="h-6 w-64 bg-cyan-400/20 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-24 bg-green-400/20 rounded animate-pulse"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-l-4 border-cyan-500/30 pl-4">
            <div className="h-5 w-48 bg-cyan-300/20 rounded mb-2 animate-pulse"></div>
            <div className="space-y-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 w-full bg-gray-300/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-green-500/30 pl-4">
            <div className="h-5 w-40 bg-green-300/20 rounded mb-2 animate-pulse"></div>
            <div className="space-y-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 w-full bg-gray-300/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-cyan-950/30 rounded-lg p-4 border border-cyan-600/20">
            <div className="h-5 w-32 bg-cyan-200/20 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-24 bg-gray-400/20 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-green-400/20 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 rounded-lg p-4 border border-purple-600/20">
            <div className="h-5 w-28 bg-purple-200/20 rounded mb-2 animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-3 w-full bg-gray-400/20 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-400/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="h-3 w-64 bg-gray-500/20 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-cyan-600/20 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Show loading skeleton
  if (isLoading || isInitializing) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ backgroundColor: getStatusColor() }}
          ></div>
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider animate-slideInLeft">
            Mission Control - Betting Analytics
          </h2>
        </div>
        <div className="text-green-400 font-mono text-sm animate-slideInRight">
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 animate-slideInLeft delay-200">
          <div className="border-l-4 border-cyan-500 pl-4">
            <h3 className="text-cyan-300 font-semibold mb-2">🚀 SPACEX MISSION PARAMETERS</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li className="animate-fadeIn delay-300">• Real-time launch tracking & betting odds</li>
              <li className="animate-fadeIn delay-400">• Mission success probability analysis</li>
              <li className="animate-fadeIn delay-500">• Historical performance data integration</li>
              <li className="animate-fadeIn delay-600">• Automated risk assessment protocols</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-green-300 font-semibold mb-2">📊 BETTING INTELLIGENCE</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li className="animate-fadeIn delay-700">• Advanced odds calculation engine</li>
              <li className="animate-fadeIn delay-800">• Multi-market analysis & comparison</li>
              <li className="animate-fadeIn delay-900">• Smart notification system</li>
              <li className="animate-fadeIn delay-1000">• Portfolio risk management</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 animate-slideInRight delay-200">
          <div className="bg-cyan-950/50 rounded-lg p-4 border border-cyan-600/30 animate-fadeIn delay-300">
            <h4 className="text-cyan-200 font-semibold mb-3">Mission Status Board</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between animate-slideInRight delay-400">
                <span className="text-gray-400">Active Missions:</span>
                <span className="text-green-400 font-mono">3</span>
              </div>
              <div className="flex justify-between animate-slideInRight delay-500">
                <span className="text-gray-400">Success Rate:</span>
                <span className="text-green-400 font-mono">94.7%</span>
              </div>
              <div className="flex justify-between animate-slideInRight delay-600">
                <span className="text-gray-400">Next Launch:</span>
                <span className="text-yellow-400 font-mono">T-2:14:33</span>
              </div>
              <div className="flex justify-between animate-slideInRight delay-700">
                <span className="text-gray-400">Market Status:</span>
                <span className="text-green-400 font-mono">OPEN</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 rounded-lg p-4 border border-purple-600/30 animate-fadeIn delay-400">
            <h4 className="text-purple-200 font-semibold mb-2">⚡ Quick Deploy</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              All systems nominal. Ready for mission execution. 
              Analytics engines are online and monitoring live data feeds.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 animate-fadeIn delay-500">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="animate-slideInLeft delay-600">
            Houston, we have confirmation. All systems are GO for betting operations.
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMissionStatus(missionStatus === 'active' ? 'standby' : 'active')}
              className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded text-xs border border-cyan-600/50 transition-all duration-300 hover:scale-105 animate-slideInRight delay-700"
            >
              {missionStatus === 'active' ? 'STANDBY' : 'ACTIVATE'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default MissionBriefing;