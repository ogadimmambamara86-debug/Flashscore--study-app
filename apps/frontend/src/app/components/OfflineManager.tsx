"use client";
import React, { useState, useEffect } from 'react';

// Use shared utils alias
import { AlertManager } from "@shared/utils/alertUtils";

interface OfflineManagerProps {
  children: React.ReactNode;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMode, setShowOfflineMode] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMode(false);
      console.log('✅ Back online!');
      AlertManager.showOnlineMode(); // now directly imported
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      setShowOfflineMode(true);
      console.log('📱 Offline mode activated');
      AlertManager.showOfflineMode(); // now directly imported
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connectivityCheck = setInterval(() => {
      fetch('/api/health', { method: 'HEAD', cache: 'no-cache', mode: 'no-cors' })
        .then(() => {
          if (!isOnline) setIsOnline(true);
          setShowOfflineMode(false);
        })
        .catch(() => {
          if (isOnline) setIsOnline(false);
          setLastOnlineTime(new Date());
          setShowOfflineMode(true);
        });
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectivityCheck);
    };
  }, []); // removed isOnline from deps to avoid loops

  // Rest of your component remains unchanged
  return (
    <>
      {children}
      {!isOnline && (
        <div>
          {/* Offline notification JSX here */}
        </div>
      )}
    </>
  );
};

export default OfflineManager;