
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import FloatingAlert, { triggerFloatingAlert } from '../components/FloatingAlert';

export default function App({ Component, pageProps }: AppProps) {
  const [floatingAlertsEnabled, setFloatingAlertsEnabled] = useState(false);

  useEffect(() => {
    // Load floating alerts preference from localStorage
    const saved = localStorage.getItem('floatingAlertsEnabled');
    if (saved) {
      setFloatingAlertsEnabled(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save floating alerts preference to localStorage
    localStorage.setItem('floatingAlertsEnabled', JSON.stringify(floatingAlertsEnabled));
  }, [floatingAlertsEnabled]);

  useEffect(() => {
    // Trigger welcome alert when enabled
    if (floatingAlertsEnabled) {
      setTimeout(() => {
        triggerFloatingAlert('Floating alerts are now enabled! 🎉', 'success');
      }, 500);
    }
  }, [floatingAlertsEnabled]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console and potentially external service
        console.error('App Error:', error, errorInfo);
        
        // Trigger floating alert for errors if enabled
        if (floatingAlertsEnabled) {
          triggerFloatingAlert(`Error: ${error.message}`, 'error', true);
        }
      }}
    >
      <Component {...pageProps} />
      
      <FloatingAlert 
        enabled={floatingAlertsEnabled}
        onToggle={setFloatingAlertsEnabled}
      />
      
      {/* Floating Alert Toggle Button */}
      {!floatingAlertsEnabled && (
        <button
          onClick={() => setFloatingAlertsEnabled(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="Enable floating alerts"
        >
          🔔 Enable Alerts
        </button>
      )}
    </ErrorBoundary>
  );
}
