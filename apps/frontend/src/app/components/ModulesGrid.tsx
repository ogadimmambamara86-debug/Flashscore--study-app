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

// Loading skeleton component
const ModulesGridSkeleton = () => { /* ...same as before... */ };

// Error component
const ModulesGridError = ({ error, onRetry }: { error: string; onRetry: () => void }) => { /* ...same as before... */ };

// Local storage key
const LOCAL_STORAGE_KEY = "cachedModules";

export default function ModulesGrid() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Load cached modules on mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      setModules(JSON.parse(cached));
      setLoading(false);
    }
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch matches from API
  const fetchMatches = async (controller?: AbortController) => {
    try {
      setLoading(true);
      setError(null);

      const signal = controller?.signal;
      const res = await fetch("/api/sports-proxy", { signal, headers: { "Cache-Control": "no-cache" } });

      if (!res.ok) throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      const data: Match[] = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format received from server");

      const mappedModules: Module[] = data.map((match) => ({
        id: String(match.id),
        title: `${match.home} vs ${match.away}`,
        description: match.prediction || "Prediction analysis in progress...",
        icon: "⚽",
        status: "online",
        // Around line 88-95 in ModulesGrid.tsx
metrics: [
  { label: "Home Team", value: match.home },
  { label: "Away Team", value: match.away },
  { label: "Prediction", value: match.prediction || "TBD" },