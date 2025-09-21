
"use client";

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    // Monitor Core Web Vitals
    const observePerformance = () => {
      // Page Load Time
      if (typeof window !== 'undefined' && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        metricsRef.current.pageLoadTime = loadTime;
      }

      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metricsRef.current.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metricsRef.current.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cleanup observers
        return () => {
          paintObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
        };
      }
    };

    const cleanup = observePerformance();
    return cleanup;
  }, []);

  const getMetrics = (): Partial<PerformanceMetrics> => {
    return { ...metricsRef.current };
  };

  const logMetrics = () => {
    const metrics = getMetrics();
    console.log('Performance Metrics:', {
      'Page Load Time': `${metrics.pageLoadTime}ms`,
      'First Contentful Paint': `${metrics.firstContentfulPaint}ms`,
      'Largest Contentful Paint': `${metrics.largestContentfulPaint}ms`,
      'Cumulative Layout Shift': metrics.cumulativeLayoutShift,
      'First Input Delay': `${metrics.firstInputDelay}ms`
    });
  };

  return {
    getMetrics,
    logMetrics
  };
};
