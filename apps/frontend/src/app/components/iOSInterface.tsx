"use client";

import React, { useState, useEffect } from "react";

interface iOSInterfaceProps {
  children: React.ReactNode;
  showstatusbar?: boolean;
  enableHapticFeedback?: boolean;
}

export default function iOSInterface({
  children,
  showstatusbar = true,
  enableHapticFeedback = true,
}: iOSInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHapticFeedback = () => {
    if (enableHapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {showstatusbar && (
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-50 flex items-center justify-between px-6 text-white text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(signalStrength)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
            <span className="text-xs">4G</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">{batteryLevel}%</span>
              <div className="w-6 h-3 border border-white rounded-sm relative">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white rounded-sm"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="w-full h-full overflow-auto"
        onClick={handleHapticFeedback}
      >
        {children}
      </div>
    </div>
  );
}
