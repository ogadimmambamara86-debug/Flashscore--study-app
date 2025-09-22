"use client";
import React, { useState, useEffect } from "react";

const MissionBriefing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [fade, setFade] = useState(true);

  const metrics = [
    { label: "Accuracy Rate", value: "94.2%", icon: "🎯", color: "#22c55e" },
    { label: "Active Users", value: "1,247", icon: "👥", color: "#06b6d4" },
    { label: "Predictions Made", value: "15,892", icon: "🔮", color: "#8b5cf6" },
    { label: "Total Winnings", value: "$2.1M", icon: "💰", color: "#f59e0b" }
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveMetric((prev) => (prev + 1) % metrics.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentMetric = metrics[activeMetric];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#111827",
      borderRadius: "1rem",
      color: "#fff",
      minWidth: "250px",
      textAlign: "center",
      transition: "opacity 0.5s",
      opacity: fade ? 1 : 0
    }}>
      <div style={{
        fontSize: "2.5rem",
        color: currentMetric.color,
        transform: fade ? "translateY(0)" : "translateY(-10px)",
        transition: "transform 0.5s, opacity 0.5s"
      }}>
        {currentMetric.icon}
      </div>
      <div style={{
        fontSize: "1.25rem",
        marginTop: "0.5rem",
        transform: fade ? "translateY(0)" : "translateY(-10px)",
        transition: "transform 0.5s, opacity 0.5s"
      }}>
        {currentMetric.label}
      </div>
      <div style={{
        fontSize: "2rem",
        fontWeight: "bold",
        marginTop: "0.25rem",
        transform: fade ? "translateY(-10px)" : "translateY(0px)",
      }}
    >
      {children}
    </div>
  );
};

export default MissionBriefing;
  );
};

export default MissionBriefing;