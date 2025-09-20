"use client";
import React, { useEffect, useState } from "react";
import FloatingAlert from "./FloatingAlert";
import ErrorBoundary from "./ErrorBoundary";
import { useLocalStorage } from "../../../../../packages/shared/src/libs/utils/clientStorage";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [floatingAlertsEnabled, setFloatingAlertsEnabled] = useLocalStorage(
    "floatingAlertsEnabled",
    false,
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && floatingAlertsEnabled) {
      setTimeout(() => {
        import("./FloatingAlert").then(({ triggerFloatingAlert }) => {
          triggerFloatingAlert("Floating alerts are now enabled! 🎉", "success");
        });
      }, 500);
    }
  }, [floatingAlertsEnabled, isClient]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("App Error:", error, errorInfo);
        if (floatingAlertsEnabled) {
          // You'll need to implement triggerFloatingAlert or import it
        }
      }}
    >
      {children}
      <FloatingAlert
        enabled={floatingAlertsEnabled}
        onToggle={setFloatingAlertsEnabled}
      />
      {isClient && !floatingAlertsEnabled && (
        <button
          onClick={() => setFloatingAlertsEnabled(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          title="Enable floating alerts"
        >
          🔔 Enable Alerts
        </button>
      )}
    </ErrorBoundary>
  );
}