import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import FloatingAlert from "../components/FloatingAlert";
import { useEffect, useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import OfflineManager from "../components/OfflineManager";

import { useLocalStorage } from "../utils/clientStorage";

export default function App({ Component, pageProps }: AppProps) {
  const [floatingAlertsEnabled, setFloatingAlertsEnabled] = useLocalStorage(
    "floatingAlertsEnabled",
    false,
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Trigger welcome alert when enabled (only on client)
    if (isClient && floatingAlertsEnabled) {
      setTimeout(() => {
        // Dynamic import to avoid SSR issues
        import("../components/FloatingAlert").then(
          ({ triggerFloatingAlert }) => {
            triggerFloatingAlert(
              "Floating alerts are now enabled! 🎉",
              "success",
            );
          },
        );
      }, 500);
    }
  }, [floatingAlertsEnabled, isClient]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console and potentially external service
        console.error("App Error:", error, errorInfo);

        // Trigger floating alert for errors if enabled
        if (floatingAlertsEnabled) {
          triggerFloatingAlert(`Error: ${error.message}`, "error", true);
        }
      }}
    >
      <Head>
        <title>
          Sports Central - Live Sports Predictions, Scores & Community
        </title>
        <meta
          name="description"
          content="Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins. Join 1000+ sports fans!"
        />
        <meta
          name="keywords"
          content="sports predictions, live scores, NFL predictions, NBA predictions, MLB predictions, soccer predictions, sports betting, sports quiz, sports community, Pi coin rewards"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Sports Central" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Sports Central - Live Sports Predictions & Community"
        />
        <meta
          property="og:description"
          content="Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins!"
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://your-app-domain.replit.app" />
        <meta property="og:site_name" content="Sports Central" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sports Central - Live Sports Predictions & Community"
        />
        <meta
          name="twitter:description"
          content="Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins!"
        />
        <meta name="twitter:image" content="/twitter-image.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://your-app-domain.replit.app" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Sports Central",
              description:
                "Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins.",
              url: "https://your-app-domain.replit.app",
              applicationCategory: "SportsApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
              features: [
                "Live Sports Scores",
                "AI Sports Predictions",
                "Interactive Quizzes",
                "Community Forum",
                "Pi Coin Rewards",
                "Multiple Sports Coverage",
              ],
            }),
          }}
        />
      </Head>
      <Component {...pageProps} />

      <FloatingAlert
        enabled={floatingAlertsEnabled}
        onToggle={setFloatingAlertsEnabled}
      />

      {/* Floating Alert Toggle Button - Only render on client */}
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
