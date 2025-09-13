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

      {/* Tesla-style header with autopilot indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          margin: 0,
          background: 'linear-gradient(135deg, #00ff88, #00a2ff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
          letterSpacing: '-1px'
        }}>
          🚗 AUTOPILOT SPORTS DASHBOARD
        </h1>

        {/* Tesla-style status indicators */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 162, 255, 0.1))',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#00ff88',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 255, 136, 0.1)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff88',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            {isMobile ? 'MOBILE MODE' : 'DESKTOP MODE'}
          </div>
          <div style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(0, 162, 255, 0.1), rgba(0, 102, 255, 0.1))',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            border: '1px solid rgba(0, 162, 255, 0.3)',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#00a2ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚡ NEURAL NET ACTIVE
          </div>
        </div>
      </div>

      <LatestNews />

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            marginBottom: '25px',
            color: '#00ff88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🎯 NEURAL PREDICTIONS
          </h2>
          <div className="grid gap-6">
            {matches.map((match, index) => (
              <div
                key={match.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 162, 255, 0.05) 100%)',
                  backdropFilter: 'blur(25px)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderLeft: `4px solid ${['#00ff88', '#00a2ff', '#0066ff', '#ff6b6b'][index % 4]}`,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 255, 136, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                  animation: 'scan 3s ease-in-out infinite'
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                  <p style={{
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    color: '#ffffff',
                    margin: 0,
                    textShadow: '0 2px 10px rgba(0, 255, 136, 0.2)'
                  }}>
                    {match.home} vs {match.away}
                  </p>
                </div>
                <p style={{
                  background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '500',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  {match.prediction}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            marginBottom: '25px',
            color: '#00a2ff',
            textShadow: '0 0 20px rgba(0, 162, 255, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🌐 EXTERNAL DATA FEED
          </h2>
          <div className="grid gap-6">
            {predictions.length > 0 ? (
              predictions.map((prediction, index) => (
                <div
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 162, 255, 0.05) 0%, rgba(0, 102, 255, 0.05) 100%)',
                    backdropFilter: 'blur(25px)',
                    padding: '25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(0, 162, 255, 0.2)',
                    borderLeft: `4px solid ${['#00a2ff', '#0066ff', '#00ff88', '#ff9f00'][index % 4]}`,
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 162, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 162, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(0, 162, 255, 0.2)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '60px',
                    height: '60px',
                    background: 'radial-gradient(circle, rgba(0, 162, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    opacity: 0.5
                  }} />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#00a2ff',
                      boxShadow: '0 0 8px rgba(0, 162, 255, 0.5)'
                    }} />
                  </div>
                  <p style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    lineHeight: '1.7',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    {prediction.title}
                  </p>
                </div>
              ))
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{ 
                  color: '#666666', 
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  🔄 Scanning for external data feeds...
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