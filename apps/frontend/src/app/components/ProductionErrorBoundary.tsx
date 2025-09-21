
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class ProductionErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging but don't crash the app
    console.error('Production Error Boundary caught error:', {
      message: error.message,
      stack: error.stack?.substring(0, 1000), // Limit stack trace
      componentStack: errorInfo.componentStack?.substring(0, 500),
      timestamp: new Date().toISOString()
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({ 
        hasError: false, 
        error: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Max retries reached, reload page
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default minimal error UI
      return (
        <div className="flex items-center justify-center min-h-[200px] p-6 bg-red-50 border border-red-200 rounded-lg mx-4">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 text-sm mb-4">
              We're sorry for the inconvenience. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {this.state.retryCount < this.maxRetries ? 'Try Again' : 'Reload Page'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;
