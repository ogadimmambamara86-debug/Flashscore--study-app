// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next'
import '@styles/globals.css'
import React from "react";
import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";
import MobileNav from "@components/MobileNav";
import SidebarNav from "@components/SidebarNav"; // <-- New desktop nav

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
      <body className="relative">
        {/* Background animation */}
        <BackgroundParticles />

        {/* Offline manager wraps everything */}
        <OfflineManager>
          <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar nav for desktop */}
            <aside className="hidden md:flex w-64 border-r border-gray-200">
              <SidebarNav />
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex flex-col">
              {children}
              {/* Mobile nav (only on small screens) */}
              <div className="md:hidden">
                <MobileNav />
              </div>
            </main>
          </div>
        </OfflineManager>
      </body>
    </html>
  )
}