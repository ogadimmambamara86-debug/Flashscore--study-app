"use client";
import React, { useState, useEffect } from "react";
import { AlertManager } from "@shared/utils/alertUtils";
import { isClient, registerNetworkEvents } from "@shared/utils/offlineUtils";
import OfflineBanner from "./OfflineBanner";

interface OfflineManagerProps {
  children: React.ReactNode;
}

interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

const OFFLINE_STORAGE_KEY = "offlineActions";

const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);

  // Load and save offline actions
  const loadPendingActions = () => (isClient ? JSON.parse(localStorage.getItem(OFFLINE_STORAGE_KEY) || "[]") : []);
  const savePendingActions = (actions: OfflineAction[]) => isClient && localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(actions));

  const addOfflineAction = (action: OfflineAction) => {
    const updated = [...pendingActions, action];
    setPendingActions(updated);
    savePendingActions(updated);
  };

  // Merge offline actions with server state
  const syncOfflineActions = async () => {
    if (!pendingActions.length || !isOnline) return;

    try {
      const response = await fetch("/api/syncActions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingActions),
      });
      const { mergedData, failedIds }: { mergedData: any; failedIds: string[] } = await response.json();

      // Update local state and remove successfully merged actions
      const remaining = pendingActions.filter(a => failedIds.includes(a.id));
      setPendingActions(remaining);
      savePendingActions(remaining);

      if (mergedData) {
        console.log("✅ Offline actions merged successfully");
      }
    } catch (error) {
      console.error("❌ Error syncing offline data:", error);
    }
  }, [pendingActions]);

  return null;
};");
      }
    } catch (error) {
      console.error("❌ Failed to sync offline actions:", error);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingActions.length > 0) {
        syncOfflineActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
    };

    if (isClient) {
      const loadedActions = loadPendingActions();
      setPendingActions(loadedActions);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <>
      {children}
      {!isOnline && <OfflineBanner lastOnlineTime={lastOnlineTime} />}
    </>
  );
};

export default OfflineManager;