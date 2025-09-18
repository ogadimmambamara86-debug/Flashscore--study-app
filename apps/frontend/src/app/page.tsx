"use client";
import React from "react";
import BackgroundParticles from "./BackgroundParticles";
import Header from "./Header";
import MissionBriefing from "./MissionBriefing";
import ModulesGrid from "./ModulesGrid";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import OfflineManager from "./OfflineManager";

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