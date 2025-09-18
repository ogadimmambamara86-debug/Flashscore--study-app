"use client";
import React from "react";
import BackgroundParticles from ".src/app/components/BackgroundParticles";
import Header from "./components/Header";
import MissionBriefing from "./../components/MissionBriefing";
import ModulesGrid from "./components/ModulesGrid";
import { useOfflineStatus } from "./hooks/useOfflineStatus";
import OfflineManager from "./components/OfflineManager";

export default function Home() {
  const isOffline = useOfflineStatus();

  return (
    <div className="relative max-w-5xl mx-auto p-10 font-mono">
      <BackgroundParticles />
      <Header />
      <MissionBriefing />
      {isOffline && <OfflineManager />}
      <ModulesGrid />
    </div>
  );
}