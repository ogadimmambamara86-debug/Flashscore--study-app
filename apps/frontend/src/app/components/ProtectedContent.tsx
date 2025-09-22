"use client";

import React from 'react';

interface ProtectedContentProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export default function ProtectedContent({
  children,
  requiredRole = 'user',
  requireAuth = false,
  fallback
}: ProtectedContentProps) {
  // Mock authentication check
  const isAuthenticated = true;
  const userRole = 'user';

  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please log in to access this content.
          </p>
        </div>
      </div>
    );
  }

  const hasRequiredRole = userRole === requiredRole || userRole === 'admin';

  if (!hasRequiredRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You don't have permission to access this content.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}