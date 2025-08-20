"use client";
import { useEffect, useState } from "react";
import LatestNews from "../components/LatestNews";
import PredictionsTable from "../components/PredictionsTable";

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

interface Prediction {
  title: string;
  content?: string;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load predictions data
  useEffect(() => {
    async function loadPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      }
    }

    loadPredictions();
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/sports").then((res) => res.json()),
      // Already fetched predictions in a separate effect
    ])
    .then(([matchesData]) => {
      setMatches(matchesData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ position: 'relative' }}>
      {/* Animated background particles */}
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 className="text-gradient" style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          margin: 0,
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          ⚽ Sports Predictions Dashboard
        </h1>

        {/* Enhanced device indicator */}
        <div className="glass-card" style={{
          padding: '8px 16px',
          background: isMobile 
            ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
            : 'linear-gradient(135deg, #06b6d4, #0891b2)',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: 'white',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          {isMobile ? '📱 Mobile' : '💻 Desktop'} Optimized
        </div>
      </div>

      <LatestNews />

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#e8f5e8',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            🎯 Our Predictions
          </h2>
          <div className="grid gap-6">
            {matches.map((match, index) => (
              <div 
                key={match.id} 
                className="glass-card"
                style={{
                  padding: '20px',
                  transition: 'all 0.3s ease',
                  borderLeft: `4px solid ${['#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'][index % 4]}`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
              >
                <p style={{
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  color: '#e8f5e8',
                  marginBottom: '8px'
                }}>
                  {match.home} vs {match.away}
                </p>
                <p style={{
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}>
                  {match.prediction}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#e8f5e8',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            🌐 External Predictions
          </h2>
          <div className="grid gap-6">
            {predictions.length > 0 ? (
              predictions.map((prediction, index) => (
                <div 
                  key={index} 
                  className="glass-card"
                  style={{
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${['#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b'][index % 4]}`,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(6, 182, 212, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <p style={{
                    color: '#d1fae5',
                    fontWeight: '500',
                    lineHeight: '1.6'
                  }}>
                    {prediction.title}
                  </p>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  No external predictions available
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tomorrow's Predictions</h2>
          <PredictionsTable />
        </div>

      </div>
    </div>
  );
}