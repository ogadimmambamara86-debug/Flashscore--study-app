
import React, { useState, useEffect } from 'react';

interface OfflineManagerProps {
  children: React.ReactNode;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMode, setShowOfflineMode] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMode(false);
      console.log('✅ Back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      setShowOfflineMode(true);
      console.log('📱 Offline mode activated');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const connectivityCheck = setInterval(() => {
      fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors'
      }).then(() => {
        if (!isOnline) {
          setIsOnline(true);
          setShowOfflineMode(false);
        }
      }).catch(() => {
        if (isOnline) {
          setIsOnline(false);
          setLastOnlineTime(new Date());
          setShowOfflineMode(true);
        }
      });
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectivityCheck);
    };
  }, [isOnline]);

  // Store data for offline use
  useEffect(() => {
    if (isOnline) {
      // Cache essential data when online
      const cacheData = async () => {
        try {
          const response = await fetch('/api/sports');
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('cached_matches', JSON.stringify({
              data,
              timestamp: Date.now()
            }));
          }
        } catch (error) {
          console.warn('Failed to cache data:', error);
        }
      };
      
      cacheData();
    }
  }, [isOnline]);

  const OfflineNotification = () => (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      maxWidth: '300px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>📱</span>
        <strong>Offline Mode</strong>
      </div>
      <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.9 }}>
        You're offline, but you can still play quizzes and view cached content!
      </p>
      {lastOnlineTime && (
        <p style={{ margin: '8px 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
          Last online: {lastOnlineTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );

  const Handle404Error = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px'
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '20px' }}>🕷️</div>
      <h2 style={{
        color: '#fff',
        fontSize: '2.5rem',
        marginBottom: '16px',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        404 - Page Not Found
      </h2>
      <p style={{
        color: '#d1fae5',
        fontSize: '1.2rem',
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        The spider web caught an error! But don't worry, you can still enjoy our offline features.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
          }}
        >
          ← Go Back
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)'
          }}
        >
          🏠 Home
        </button>
        
        <button
          onClick={() => setShowOfflineMode(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}
        >
          🎮 Play Offline
        </button>
      </div>
    </div>
  );

  return (
    <>
      {children}
      {!isOnline && <OfflineNotification />}
    </>
  );
};

export default OfflineManager;
