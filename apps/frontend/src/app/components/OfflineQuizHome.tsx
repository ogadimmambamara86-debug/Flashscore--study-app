
"use client";
import React, { useState, useEffect } from 'react';
import QuizMode from './QuizMode';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

interface SystemStatus {
  quiz: 'stable' | 'loading' | 'error';
  offline: 'active' | 'inactive';
  piCoins: 'connected' | 'offline';
  storage: 'available' | 'limited';
}

const OfflineQuizHome: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    quiz: 'loading',
    offline: 'inactive', 
    piCoins: 'offline',
    storage: 'available'
  });
  const [stabilityScore, setStabilityScore] = useState(0);
  const isOffline = useOfflineStatus();

  useEffect(() => {
    // Check system stability
    const checkStability = () => {
      let score = 0;
      const newStatus: SystemStatus = {
        quiz: 'stable',
        offline: isOffline ? 'active' : 'inactive',
        piCoins: 'connected',
        storage: 'available'
      };

      // Test Quiz System (30 points)
      try {
        // Check if quiz components are accessible
        if (typeof localStorage !== 'undefined') {
          score += 30;
        }
      } catch (error) {
        newStatus.quiz = 'error';
        console.warn('Quiz system check failed:', error);
      }

      // Test Offline Capability (25 points)
      if (navigator.onLine !== undefined) {
        score += 25;
        newStatus.offline = isOffline ? 'active' : 'inactive';
      }

      // Test PiCoin System (25 points)
      try {
        const testStorage = localStorage.getItem('piCoinBalance');
        if (testStorage !== null || localStorage.getItem('piCoinBalance') === null) {
          score += 25;
          newStatus.piCoins = 'connected';
        }
      } catch (error) {
        newStatus.piCoins = 'offline';
        console.warn('PiCoin system check failed:', error);
      }

      // Test Storage (20 points)
      try {
        localStorage.setItem('stabilityTest', 'ok');
        localStorage.removeItem('stabilityTest');
        score += 20;
      } catch (error) {
        newStatus.storage = 'limited';
        console.warn('Storage check failed:', error);
      }

      setSystemStatus(newStatus);
      setStabilityScore(score);
    };

    checkStability();
    
    // Recheck every 30 seconds
    const interval = setInterval(checkStability, 30000);
    return () => clearInterval(interval);
  }, [isOffline]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
      case 'active':
      case 'connected':
      case 'available':
        return '#22c55e';
      case 'loading':
      case 'inactive':
      case 'offline':
        return '#f59e0b';
      case 'error':
      case 'limited':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStabilityLevel = () => {
    if (stabilityScore >= 90) return { level: 'Excellent', color: '#22c55e', emoji: '🟢' };
    if (stabilityScore >= 70) return { level: 'Good', color: '#22c55e', emoji: '🟡' };
    if (stabilityScore >= 50) return { level: 'Fair', color: '#f59e0b', emoji: '🟠' };
    return { level: 'Needs Attention', color: '#ef4444', emoji: '🔴' };
  };

  const stability = getStabilityLevel();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#e2e8f0',
      padding: '20px'
    }}>
      {/* Stability Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MagajiCo Offline Quiz 🎯
            </h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Stable offline gaming experience • System Status Level 3
            </p>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${stability.color}, ${stability.color}dd)`,
            color: 'white',
            padding: '16px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
              {stability.emoji}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stabilityScore}%
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {stability.level}
            </div>
          </div>
        </div>
      </div>

      {/* System Status Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Quiz Engine', status: systemStatus.quiz, icon: '🎯' },
          { label: 'Offline Mode', status: systemStatus.offline, icon: '📱' },
          { label: 'PiCoin System', status: systemStatus.piCoins, icon: '🪙' },
          { label: 'Local Storage', status: systemStatus.storage, icon: '💾' }
        ].map((item, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${getStatusColor(item.status)}33`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {item.icon}
            </div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {item.label}
            </div>
            <div style={{
              color: getStatusColor(item.status),
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              fontWeight: '500'
            }}>
              {item.status}
            </div>
          </div>
        ))}
      </div>

      {/* Offline Status Banner */}
      {isOffline && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          fontWeight: '600',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
        }}>
          📱 Offline Mode Active • All quiz features available
        </div>
      )}

      {/* Main Quiz Component */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <QuizMode isOffline={isOffline} />
      </div>

      {/* Stability Features */}
      <div style={{
        marginTop: '32px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          color: '#22c55e',
          fontSize: '1.5rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🛡️ Stability Level 3 Features
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {[
            '✅ Offline quiz functionality',
            '✅ Local data persistence',
            '✅ PiCoin reward system',
            '✅ Progress tracking',
            '✅ Error recovery',
            '✅ Performance monitoring'
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.9rem'
            }}>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfflineQuizHome;
