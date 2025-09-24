
"use client";

import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState<string>('checking...');
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Test backend connection
    fetch('/api/backend/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus('✅ Connected');
        console.log('Backend health:', data);
      })
      .catch(err => {
        setBackendStatus('❌ Disconnected');
        console.error('Backend error:', err);
      });

    // Fetch predictions
    fetch('/api/backend/predictions')
      .then(res => res.json())
      .then(data => {
        setPredictions(data.data || []);
      })
      .catch(err => console.error('Predictions error:', err));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "#ffffff",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>⚽ MagajiCo</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Smart Football Predictions Platform</p>
      </header>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Status Card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>🔧 System Status</h3>
          <p><strong>Frontend:</strong> ✅ Next.js Running</p>
          <p><strong>Backend:</strong> {backendStatus}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>🚀 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => window.open('/api/test', '_blank')}
              style={{
                padding: '10px',
                backgroundColor: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Test Frontend API
            </button>
            <button
              onClick={() => window.open('/debug', '_blank')}
              style={{
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Debug Page
            </button>
          </div>
        </div>

        {/* Predictions Preview */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          gridColumn: '1 / -1'
        }}>
          <h3>⚽ Live Predictions</h3>
          {predictions.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {predictions.map((pred, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>{pred.match}</strong></span>
                    <span style={{ color: '#4ade80' }}>{pred.prediction}</span>
                    <span style={{ 
                      backgroundColor: pred.confidence > 80 ? '#10b981' : '#f59e0b',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {pred.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.7 }}>Loading predictions...</p>
          )}
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', opacity: 0.7 }}>
        <p>🏆 Powered by MagajiCo Technology | Next.js + Express Backend</p>
      </footer>
    </div>
  );
}
