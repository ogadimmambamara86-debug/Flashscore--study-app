
"use client";
import React, { useState, useEffect } from 'react';
import { MagajiCoManager } from './MagajiCoManager';

// 🏗️ MAGAJICO FOUNDATION - Building from Ground Up
interface MagajiCoFoundation {
  level: 'foundation' | 'structure' | 'framework' | 'rooftop';
  components: string[];
  powerLevel: number;
  completion: number;
}

interface BuildingPhase {
  id: string;
  name: string;
  description: string;
  requiredPower: number;
  unlocked: boolean;
  building: boolean;
  completed: boolean;
  components: BuildingComponent[];
}

interface BuildingComponent {
  name: string;
  type: 'ai' | 'prediction' | 'community' | 'crypto' | 'security';
  powerBoost: number;
  installed: boolean;
}

export default function MagajiCoFoundation() {
  const [currentPhase, setCurrentPhase] = useState<string>('foundation');
  const [totalPower, setTotalPower] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);

  const buildingPhases: BuildingPhase[] = [
    {
      id: 'foundation',
      name: '🏗️ FOUNDATION LAYER',
      description: 'Bezos-level customer obsession meets Musk innovation',
      requiredPower: 0,
      unlocked: true,
      building: false,
      completed: false,
      components: [
        { name: 'MagajiCo AI Core', type: 'ai', powerBoost: 25, installed: false },
        { name: 'Prediction Engine', type: 'prediction', powerBoost: 20, installed: false },
        { name: 'User Security Layer', type: 'security', powerBoost: 15, installed: false },
        { name: 'Community Foundation', type: 'community', powerBoost: 10, installed: false }
      ]
    },
    {
      id: 'structure',
      name: '🏢 STRUCTURE FRAMEWORK',
      description: 'Gates methodology with Ma ecosystem thinking',
      requiredPower: 70,
      unlocked: false,
      building: false,
      completed: false,
      components: [
        { name: 'Advanced Analytics', type: 'ai', powerBoost: 30, installed: false },
        { name: 'Real-time Predictions', type: 'prediction', powerBoost: 35, installed: false },
        { name: 'Social Features', type: 'community', powerBoost: 25, installed: false },
        { name: 'Pi Coin Integration', type: 'crypto', powerBoost: 40, installed: false }
      ]
    },
    {
      id: 'framework',
      name: '🔧 ADVANCED FRAMEWORK',
      description: 'Zuckerberg network effects with innovation',
      requiredPower: 200,
      unlocked: false,
      building: false,
      completed: false,
      components: [
        { name: 'Machine Learning Hub', type: 'ai', powerBoost: 50, installed: false },
        { name: 'Prediction Markets', type: 'prediction', powerBoost: 45, installed: false },
        { name: 'Global Community', type: 'community', powerBoost: 40, installed: false },
        { name: 'Advanced Security', type: 'security', powerBoost: 35, installed: false }
      ]
    },
    {
      id: 'rooftop',
      name: '🏆 LEGENDARY ROOFTOP',
      description: 'All titans combined - Ultimate Sports AI Empire',
      requiredPower: 370,
      unlocked: false,
      building: false,
      completed: false,
      components: [
        { name: 'Quantum AI Predictions', type: 'ai', powerBoost: 100, installed: false },
        { name: 'Global Sports Oracle', type: 'prediction', powerBoost: 85, installed: false },
        { name: 'Worldwide Community', type: 'community', powerBoost: 75, installed: false },
        { name: 'Crypto Sports Empire', type: 'crypto', powerBoost: 90, installed: false }
      ]
    }
  ];

  const [phases, setPhases] = useState(buildingPhases);

  // Build animation effect
  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setBuildingProgress(prev => {
          if (prev >= 100) {
            setIsBuilding(false);
            completeCurrentPhase();
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isBuilding]);

  // Update phase unlocks based on power
  useEffect(() => {
    setPhases(prevPhases => 
      prevPhases.map(phase => ({
        ...phase,
        unlocked: totalPower >= phase.requiredPower
      }))
    );
  }, [totalPower]);

  const startBuilding = (phaseId: string) => {
    setCurrentPhase(phaseId);
    setIsBuilding(true);
    setBuildingProgress(0);
    
    setPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId 
          ? { ...phase, building: true }
          : phase
      )
    );
  };

  const completeCurrentPhase = () => {
    setPhases(prev => 
      prev.map(phase => {
        if (phase.id === currentPhase) {
          const installedComponents = phase.components.map(comp => ({ ...comp, installed: true }));
          const phaseBoost = installedComponents.reduce((sum, comp) => sum + comp.powerBoost, 0);
          setTotalPower(prevPower => prevPower + phaseBoost);
          
          return {
            ...phase,
            building: false,
            completed: true,
            components: installedComponents
          };
        }
        return phase;
      })
    );
  };

  const installComponent = (phaseId: string, componentName: string) => {
    setPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId 
          ? {
              ...phase,
              components: phase.components.map(comp => 
                comp.name === componentName 
                  ? { ...comp, installed: true }
                  : comp
              )
            }
          : phase
      )
    );
  };

  const getComponentIcon = (type: string) => {
    const icons = {
      ai: '🤖',
      prediction: '🔮',
      community: '👥',
      crypto: '💰',
      security: '🛡️'
    };
    return icons[type as keyof typeof icons] || '⚡';
  };

  const getPowerColor = (power: number) => {
    if (power < 100) return '#ef4444';
    if (power < 250) return '#f59e0b';
    if (power < 400) return '#10b981';
    return '#8b5cf6';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🏗️ MagajiCo Empire Builder
        </h1>
        <p className="text-xl text-gray-300">Building from Foundation to Legendary Rooftop</p>
        
        {/* Power Display */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-500">
            <div className="text-center">
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: getPowerColor(totalPower) }}
              >
                ⚡ {totalPower}
              </div>
              <div className="text-sm text-gray-400">Total Empire Power</div>
              <div className="mt-3 w-64 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-red-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (totalPower / 500) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Building Progress */}
      {isBuilding && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border-2 border-blue-500">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">🚧 Building in Progress...</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-200"
                style={{ width: `${buildingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400">{buildingProgress.toFixed(0)}% Complete</div>
          </div>
        </div>
      )}

      {/* Building Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {phases.map((phase, index) => (
          <div 
            key={phase.id}
            className={`
              relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-300
              ${phase.completed ? 'border-green-500 bg-green-900/20' : 
                phase.unlocked ? 'border-blue-500 hover:border-yellow-500' : 
                'border-gray-600 opacity-50'}
            `}
          >
            {/* Phase Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">{phase.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{phase.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Required Power</div>
                <div className="text-lg font-bold text-yellow-400">{phase.requiredPower}</div>
              </div>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {phase.components.map((component, compIndex) => (
                <div 
                  key={compIndex}
                  className={`
                    p-3 rounded-lg border transition-all duration-200
                    ${component.installed ? 
                      'bg-green-900/30 border-green-500' : 
                      'bg-gray-700 border-gray-600 hover:border-gray-500'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getComponentIcon(component.type)}</span>
                    <div>
                      <div className="text-sm font-medium">{component.name}</div>
                      <div className="text-xs text-gray-400">+{component.powerBoost} Power</div>
                    </div>
                  </div>
                  {component.installed && (
                    <div className="text-green-400 text-xs mt-1">✅ Installed</div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              {phase.completed ? (
                <div className="text-green-400 font-bold">✅ Phase Complete!</div>
              ) : phase.building ? (
                <div className="text-blue-400 font-bold">🚧 Building...</div>
              ) : phase.unlocked ? (
                <button
                  onClick={() => startBuilding(phase.id)}
                  disabled={isBuilding}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
                >
                  🏗️ Start Building
                </button>
              ) : (
                <div className="text-gray-500 font-bold">🔒 Locked (Need {phase.requiredPower} Power)</div>
              )}
            </div>

            {/* Phase Number */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Celebration */}
      {phases.every(phase => phase.completed) && (
        <div className="mt-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            🎉 LEGENDARY MAGAJICO EMPIRE COMPLETE! 🎉
          </h2>
          <p className="text-xl text-white mb-4">
            You've built the ultimate AI-powered sports prediction empire!
          </p>
          <div className="text-6xl mb-4">👑</div>
          <div className="text-2xl font-bold text-white">
            Total Power: {totalPower} ⚡
          </div>
        </div>
      )}
    </div>
  );
}
