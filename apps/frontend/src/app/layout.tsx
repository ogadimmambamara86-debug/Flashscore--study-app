// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next'
import '@styles/globals.css'
import React from "react";
import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";
import MobileNav from "@components/MobileNav";
import SidebarNav from "@components/SidebarNav";
import ErrorBoundary from "@components/ErrorBoundary"; // Add this import
import { navItems } from "@config/navItems";

export const metadata: Metadata = {
  title: 'Sports Central - Live Sports Predictions, Scores & Community',
  description: 'Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins. Join 1000+ sports fans!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative flex">
        <BackgroundParticles />
        <ErrorBoundary> {/* Wrap everything in ErrorBoundary */}
          <OfflineManager>
            {/* Sidebar for desktop */}
            <SidebarNav items={navItems} />

            {/* Main content area */}
            <div className="flex-1 min-h-screen flex flex-col">
              {children}

              {/* Mobile nav (always visible at bottom on small screens) */}
              <MobileNav items={navItems} />
            </div>
          </OfflineManager>
        </ErrorBoundary>
      </body>
    </html>
  )
}