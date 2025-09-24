"use client";
import React, { useState, useEffect } from "react";
import PhaseCard from "./PhaseCard";
import PowerDisplay from "./PowerDisplay";

export default function MagajiCoFoundation() {
  const [totalPower, setTotalPower] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>("foundation");

  const buildingPhases = [
    // Copy your original phases array here
  ];

  const [phases, setPhases] = useState(buildingPhases);

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

  useEffect(() => {
    setPhases(prevPhases => 
      prevPhases.map(phase => ({ ...phase, unlocked: totalPower >= phase.requiredPower }))
    );
  }, [totalPower]);

  const startBuilding = (phaseId: string) => {
    setCurrentPhase(phaseId);
    setIsBuilding(true);
    setBuildingProgress(0);
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, building: true } : p));
  };

  const completeCurrentPhase = () => {
    setPhases(prev => prev.map(p => {
      if (p.id === currentPhase) {
        const installedComponents = p.components.map(c => ({ ...c, installed: true }));
        const phaseBoost = installedComponents.reduce((sum, c) => sum + c.powerBoost, 0);
        setTotalPower(prev => prev + phaseBoost);
        return { ...p, building: false, completed: true, components: installedComponents };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white">
      <h1 className="text-center text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
        🏗️ MagajiCo Empire Builder
      </h1>
      <p className="text-center text-xl text-gray-300 mb-6">Building from Foundation to Legendary Rooftop</p>

      <PowerDisplay totalPower={totalPower} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            currentPhase={currentPhase}
            isBuilding={isBuilding}
            startBuilding={startBuilding}
          />
        ))}
      </div>
    </div>
  );
}
