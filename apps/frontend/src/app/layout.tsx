// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next'
import '@styles/globals.css'
import React from "react";
import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";
import MobileNav from "@components/MobileNav";
import SidebarNav from "@components/SidebarNav";
import { navItems } from "@config/navItems"; // 👈 shared config

// Note: inter.className is not defined in the provided snippet, assuming it's imported elsewhere or a placeholder.
// If inter is meant to be imported from 'next/font/google', it should be defined like:
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });
// For the purpose of this edit, we will proceed assuming 'inter' is available.
// If it's not, the build will fail, and it needs to be added to the imports.

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
    <html lang="en" className="light">
      <body className="relative flex">
        <BackgroundParticles />
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
      </body>
    </html>
  )
}