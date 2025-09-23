"use client";
import React, { useState, useEffect } from 'react';

interface AlertMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  persistent?: boolean;
}

interface FloatingAlertProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const FloatingAlert: React.FC<FloatingAlertProps> = React.memo(({ enabled, onToggle }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleAlert = (event: CustomEvent<AlertMessage>) => {
      const newAlert = { ...event.detail, id: Date.now().toString(), timestamp: Date.now() };
      setAlerts(prev => [...prev, newAlert]);

      if (!newAlert.persistent) {
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 5000);
      }
    };

    window.addEventListener('floatingAlert', handleAlert as EventListener);
    return () => {
      window.removeEventListener('floatingAlert', handleAlert as EventListener);
    };
  }, [enabled]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - dragOffset.x, y: clientY - dragOffset.y });
  };

  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragOffset]);

  const removeAlert = (id: string) => setAlerts(prev => prev.filter(alert => alert.id !== id));

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  if (!enabled) return null;

  return (
    <div style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 10000, maxWidth: '350px', userSelect: 'none' }}>
      <div
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px 12px 0 0',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          fontWeight: '600',
          touchAction: 'none',
          userSelect: 'none'
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <span>🔔 Alerts ({alerts.length})</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setAlerts([])} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }} title="Clear all alerts">Clear</button>
          <button onClick={() => onToggle(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }} title="Disable floating alerts">✕</button>
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '0 0 8px 8px', border: '1px solid rgba(255,255,255,0.3)' }}>
        {alerts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>No alerts yet</div>
        ) : alerts.map(alert => (
          <div key={alert.id} style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}
            onClick={() => removeAlert(alert.id)}
          >
            <span style={{ fontSize: '1.2rem' }}>{getAlertIcon(alert.type)}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#333', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '4px' }}>{alert.message}</div>
              <div style={{ color: '#666', fontSize: '0.8rem' }}>{new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
            <button onClick={() => removeAlert(alert.id)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
});

// Utility function
export const triggerFloatingAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', persistent: boolean = false) => {
  const event = new CustomEvent('floatingAlert', { detail: { message, type, persistent } });
  window.dispatchEvent(event);
};

export default FloatingAlert;