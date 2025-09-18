"use client";
import React from "react";
import Header from "@components/Header";
import MissionBriefing from "@components/MissionBriefing";
import ModulesGrid from "@components/ModulesGrid";
import { useOfflineStatus } from "@hooks/useOfflineStatus";

export default function Home() {
  const isOffline = useOfflineStatus();

  return (
    <div className="relative max-w-5xl mx-auto p-10 font-mono">
      <Header />
      <MissionBriefing />
      {isOffline && <div>Offline Mode</div>}
      <ModulesGrid />
    </div>
  );
}