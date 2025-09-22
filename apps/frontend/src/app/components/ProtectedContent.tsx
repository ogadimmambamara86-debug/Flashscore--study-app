"use client";
import React, { useEffect, useState } from 'react';
import VisitorManager from '../../../../../packages/shared/src/libs/utils/visitorManager';
import ContentPaywall from './ContentPaywall';

interface ProtectedContentProps {
  contentType: 'predictions' | 'live_data' | 'statistics' | 'premium_analysis';
  contentId: string;
  title: string;
  preview?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgrade?: () => void;
  onRegister?: () => void;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({
  contentType,
  contentId,
  title,
  preview,
  children,
  fallback,
  onUpgrade,
  onRegister
}) => {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);

  useEffect(() => {
    // Track visitor
    VisitorManager.trackVisitor();

    // Check access permissions
    const accessCheck = VisitorManager.canAccessContent(contentType);
    setAccessGranted(accessCheck.allowed);
    setAccessInfo(accessCheck);

    // Record content access if allowed
    if (accessCheck.allowed) {
      VisitorManager.recordContentAccess(contentType, contentId);
    }
  }, [contentType, contentId]);

  // Loading state
  if (accessGranted === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: '#ccc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔄</div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  // Access denied - show paywall
  if (!accessGranted) {
    return (
      <ContentPaywall
        contentType={contentType}
        title={title}
        preview={preview}
        onUpgrade={onUpgrade}
        onRegister={onRegister}
      />
    );
  }

  // Access granted - show content with usage indicator
  return (
    <div style={{ position: 'relative' }}>
      {/* Usage Indicator */}
      {accessInfo?.visitsRemaining !== undefined && accessInfo.visitsRemaining <= 3 && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: accessInfo.visitsRemaining <= 1 ? '#ef4444' : '#f59e0b',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '600',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {accessInfo.visitsRemaining} left today
        </div>
      )}

      {/* Actual Content */}
      {children}

      {/* Bottom notification for low usage */}
      {accessInfo?.visitsRemaining !== undefined && accessInfo.visitsRemaining <= 1 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          ⚠️ You have {accessInfo.visitsRemaining} {contentType} view{accessInfo.visitsRemaining !== 1 ? 's' : ''} remaining today.
          {accessInfo.upgradeRequired && (
            <button
              onClick={onRegister}
              style={{
                marginLeft: '12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Get More Access
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProtectedContent;
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedContent: React.FC<Props> = ({ children, requireAuth = false }) => {
  if (requireAuth) {
    // Add authentication logic here
    return (
      <div className="text-center p-6">
        <p>Please log in to access this content</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
'use client';

import React from 'react';

interface ProtectedContentProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  children, 
  requireAuth = false,
  fallback 
}) => {
  // Simple implementation - can be enhanced with actual auth logic
  const isAuthenticated = true; // Replace with actual auth check

  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="text-center p-8">
        <p className="text-gray-600">Please log in to access this content.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
