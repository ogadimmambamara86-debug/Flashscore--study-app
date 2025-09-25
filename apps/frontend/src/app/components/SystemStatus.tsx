
'use client';

import React from 'react';
import { useBackendHealth } from '../hooks/useBackendHealth';

const SystemStatus: React.FC = () => {
  const { isHealthy, isLoading, error } = useBackendHealth();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">System Status</h3>
      <div className="flex items-center space-x-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            isLoading ? 'bg-yellow-500' : 
            isHealthy ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {isLoading ? 'Checking...' : 
           isHealthy ? 'All systems operational' : 'System issues detected'}
        </span>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">
          Backend: {error.message}
        </p>
      )}
    </div>
  );
};

export default SystemStatus;
