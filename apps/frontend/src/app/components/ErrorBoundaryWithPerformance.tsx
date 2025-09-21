
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertManager } from '../../../../../packages/shared/src/libs/utils/alertUtils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryWithPerformance extends Component<Props, State> {
  private performanceStart: number;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.performanceStart = performance.now();
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const performanceEnd = performance.now();
    const renderTime = performanceEnd - this.performanceStart;

    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.log('Render time before error:', renderTime, 'ms');

    // Log to your error tracking service
    this.logErrorToService(error, errorInfo, renderTime);

    this.setState({ error, errorInfo });
    AlertManager.showError(`Application error: ${error.message}`);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo, renderTime: number) {
    // Here you would send to your error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      renderTime,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    console.log('Error data for tracking service:', errorData);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We've encountered an unexpected error. Our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithPerformance;
