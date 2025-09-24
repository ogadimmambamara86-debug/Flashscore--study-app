
"use client";
import React, { useState } from "react";
import LatestNews from "./LatestNews";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";

export default function MagajiCoManager() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // News refresh functionality
  const refreshNews = () => {
    triggerFloatingAlert("🔄 Refreshing news feed...", "info");
    setTimeout(() => {
      triggerFloatingAlert("✅ News updated successfully!", "success");
      // Force component re-render by triggering a custom event
      window.dispatchEvent(new CustomEvent('refreshNews'));
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '20px'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 10px 0'
            }}>
              📰 MagajiCo News Dashboard
            </h1>
            <p style={{
              color: '#d1fae5',
              fontSize: '1.1rem',
              margin: 0,
              opacity: 0.9
            }}>
              Stay updated with the latest sports news and updates
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={refreshNews}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 182, 212, 0.3)';
              }}
            >
              🔄 Refresh News
            </button>
            
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '8px 16px',
              color: '#22c55e',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              📡 Live Feed Active
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
          <div style={{ color: '#22c55e', fontWeight: '600', fontSize: '1.5rem' }}>12</div>
          <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Active Stories</div>
        </div>

        <div style={{
          background: 'rgba(6, 182, 212, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👁️</div>
          <div style={{ color: '#06b6d4', fontWeight: '600', fontSize: '1.5rem' }}>2.4K</div>
          <div style={{ color: '#e0f7fa', fontSize: '0.9rem' }}>Total Views</div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
          <div style={{ color: '#f59e0b', fontWeight: '600', fontSize: '1.5rem' }}>5m</div>
          <div style={{ color: '#fef3c7', fontSize: '0.9rem' }}>Last Update</div>
        </div>

        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
          <div style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '1.5rem' }}>98%</div>
          <div style={{ color: '#ede9fe', fontSize: '0.9rem' }}>Accuracy</div>
        </div>
      </div>

      {/* Main News Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <LatestNews />
      </div>

      {/* Floating Alerts Panel */}
      <FloatingAlert enabled={alertsEnabled} onToggle={setAlertsEnabled} />
    </div>
  );
}
