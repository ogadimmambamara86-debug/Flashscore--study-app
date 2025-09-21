"use client";
import React, { useState, useEffect } from "react";
import { AlertManager } from '@shared/utils/alertUtils';
 { isClient, registerNetworkEvents } from "@shared/utils/offlineUtils";
import OfflineBanner from "./OfflineBanner";

interface OfflineManagerProps {
  children: React.ReactNode;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isClient) return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      console.log("✅ Back online!");
      AlertManager.showOnlineMode();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      console.log("📱 Offline mode activated");
      AlertManager.showOfflineMode();
    };

    const cleanup = registerNetworkEvents(handleOnline, handleOffline);

    // Optional connectivity check
    const connectivityCheck = setInterval(() => {
      fetch("/api/health", { method: "HEAD", cache: "no-cache" })
        .then(() => {
          if (!isOnline) {
            setIsOnline(true);
            AlertManager.showOnlineMode();
          }
        })
        .catch(() => {
          if (isOnline) {
            setIsOnline(false);
            setLastOnlineTime(new Date());
            AlertManager.showOfflineMode();
          }
        });
    }, 60000);

    return () => {
      cleanup();
      clearInterval(connectivityCheck);
    };
  }, [isOnline]);

  return (
    <>
      {children}
      {!isOnline && <OfflineBanner lastOnlineTime={lastOnlineTime} />}
    </>
  );
};

export default OfflineManager;