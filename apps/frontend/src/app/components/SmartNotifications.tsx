
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface Notification {
  id: string;
  type: 'match' | 'achievement' | 'social' | 'prediction' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  icon: string;
}

interface NotificationSettings {
  matchUpdates: boolean;
  achievements: boolean;
  socialActivity: boolean;
  predictionReminders: boolean;
  dailyDigest: boolean;
  pushEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const SmartNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    matchUpdates: true,
    achievements: true,
    socialActivity: true,
    predictionReminders: true,
    dailyDigest: true,
    pushEnabled: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [showPanel, setShowPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadNotifications();
    loadSettings();
    requestNotificationPermission();
    
    // Check for new notifications every 5 minutes
    const interval = setInterval(checkForNewNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const saved = ClientStorage.getItem('smart_notifications', []);
    setNotifications(saved);
  };

  const loadSettings = () => {
    const saved = ClientStorage.getItem('notification_settings', settings);
    setSettings(saved);
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    ClientStorage.setItem('notification_settings', newSettings);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({ ...prev, pushEnabled: permission === 'granted' }));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications.slice(0, 49)]; // Keep last 50
    setNotifications(updatedNotifications);
    ClientStorage.setItem('smart_notifications', updatedNotifications);

    // Show browser notification if enabled
    if (settings.pushEnabled && shouldShowNotification(newNotification)) {
      showBrowserNotification(newNotification);
    }
  };

  const shouldShowNotification = (notification: Notification): boolean => {
    if (!settings.pushEnabled) return false;
    
    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const start = settings.quietHours.start;
      const end = settings.quietHours.end;
      
      if (start > end) { // Crosses midnight
        if (currentTime >= start || currentTime <= end) return false;
      } else {
        if (currentTime >= start && currentTime <= end) return false;
      }
    }

    // Check type-specific settings
    switch (notification.type) {
      case 'match': return settings.matchUpdates;
      case 'achievement': return settings.achievements;
      case 'social': return settings.socialActivity;
      case 'prediction': return settings.predictionReminders;
      default: return true;
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });
    }
  };

  const checkForNewNotifications = () => {
    // Simulate smart notifications based on user activity
    const now = new Date();
    const hour = now.getHours();
    
    // Morning digest
    if (hour === 9 && settings.dailyDigest) {
      addNotification({
        type: 'reminder',
        title: '🌅 Good Morning!',
        message: 'Check out today\'s top predictions and upcoming matches',
        priority: 'medium',
        icon: '🌅'
      });
    }
    
    // Evening summary
    if (hour === 18 && settings.dailyDigest) {
      addNotification({
        type: 'reminder',
        title: '🌆 Evening Update',
        message: 'Review your prediction results and tomorrow\'s opportunities',
        priority: 'medium',
        icon: '🌆'
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    ClientStorage.setItem('smart_notifications', updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    ClientStorage.setItem('smart_notifications', updated);
  };

  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    ClientStorage.setItem('smart_notifications', updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    ClientStorage.setItem('smart_notifications', []);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.2rem',
            position: 'relative'
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: '600'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            width: isMobile ? '320px' : '400px',
            maxHeight: '600px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>
                🔔 Notifications
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#22c55e',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowPanel(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  padding: '40px 20px'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    style={{
                      background: notification.read 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(34, 197, 94, 0.1)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: `1px solid ${notification.read 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(34, 197, 94, 0.3)'}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{notification.icon}</span>
                        <span style={{
                          background: getPriorityColor(notification.priority),
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <h4 style={{
                      color: notification.read ? '#d1d5db' : '#fff',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      {notification.title}
                    </h4>
                    
                    <p style={{
                      color: notification.read ? '#9ca3af' : '#d1fae5',
                      fontSize: '0.8rem',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#6b7280'
                    }}>
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Settings Quick Access */}
            <div style={{
              marginTop: '20px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                {settings.pushEnabled ? '🔔 Push enabled' : '🔕 Push disabled'}
              </span>
              <button
                onClick={clearAllNotifications}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '30px',
        right: isMobile ? '20px' : '30px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 999
      }}>
        <button
          onClick={requestNotificationPermission}
          style={{
            background: settings.pushEnabled 
              ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          {settings.pushEnabled ? '🔔 Notifications On' : '🔕 Enable Notifications'}
        </button>
      </div>
    </>
  );
};

export default SmartNotifications;
