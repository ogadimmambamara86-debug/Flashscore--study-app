// apps/frontend/app/layout.tsx
import React from "react";

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
      <body>{children}</body>
    </html>
  );
}
