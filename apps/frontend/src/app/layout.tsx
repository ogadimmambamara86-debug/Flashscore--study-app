// apps/frontend/src/app/layout.tsx
import React from "react";
import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";

export const metadata = {
  title: "Flashscore Study App",
  description: "Built with Next.js 14 App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        {/* Background animation */}
        <BackgroundParticles />

        {/* Offline manager wraps all children so notifications work globally */}
        <OfflineManager>
          {children}
        </OfflineManager>
      </body>
    </html>
  );
}