
import React, { useState, useEffect } from 'react';
import SecurityUtils from '../utils/securityUtils';

interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ isOpen, onClose }) => {
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    failedLogins: 0,
    rateLimitHits: 0,
    lastUpdate: new Date().toLocaleString()
  });

  useEffect(() => {
    if (isOpen && typeof localStorage !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      setSecurityLogs(logs.slice(0, 20)); // Show last 20 events
      
      setStats({
        totalEvents: logs.length,
        failedLogins: logs.filter((log: any) => log.event.includes('login_attempt')).length,
        rateLimitHits: logs.filter((log: any) => log.event.includes('rate_limit')).length,
        lastUpdate: new Date().toLocaleString()
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getEventColor = (event: string) => {
    if (event.includes('successful')) return '#22c55e';
    if (event.includes('failed') || event.includes('invalid') || event.includes('rate_limit')) return '#ef4444';
    if (event.includes('attempt')) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        height: '80%',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
            🛡️ Security Dashboard
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        {/* Security Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#22c55e', fontSize: '2rem', fontWeight: '700' }}>
              {stats.totalEvents}
            </div>
            <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Total Security Events</div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>
              {stats.failedLogins}
            </div>
            <div style={{ color: '#fecaca', fontSize: '0.9rem' }}>Failed Login Attempts</div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: '700' }}>
              {stats.rateLimitHits}
            </div>
            <div style={{ color: '#fde68a', fontSize: '0.9rem' }}>Rate Limit Violations</div>
          </div>
        </div>

        {/* Security Logs */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.2rem' }}>
            Recent Security Events
          </h3>
          
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {securityLogs.length === 0 ? (
              <div style={{ color: '#d1fae5', textAlign: 'center', padding: '20px' }}>
                No security events recorded
              </div>
            ) : (
              securityLogs.map((log, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  padding: '12px',
                  borderLeft: `4px solid ${getEventColor(log.event)}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      color: getEventColor(log.event),
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {log.event.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span style={{ color: '#d1fae5', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {log.details && (
                    <div style={{ color: '#d1fae5', fontSize: '0.8rem' }}>
                      {JSON.stringify(log.details, null, 2).substring(0, 100)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ 
          marginTop: '16px', 
          color: '#d1fae5', 
          fontSize: '0.8rem', 
          textAlign: 'center' 
        }}>
          Last updated: {stats.lastUpdate}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
