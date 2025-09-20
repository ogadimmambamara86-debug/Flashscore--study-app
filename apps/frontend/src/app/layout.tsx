// apps/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "@styles/globals.css";
import React from "react";
import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";

export const metadata: Metadata = {
  title: "Sports Central - Live Sports Predictions, Scores & Community",
  description:
    "Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins. Join 1000+ sports fans!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 🚀 Default SpaceX theme applied here */}
      <body className="relative spacex">
        {/* Background animation */}
        <BackgroundParticles />

        {/* Offline manager wraps all children so notifications work globally */}
        <OfflineManager>{children}</OfflineManager>
      </body>
    </html>
  );
}