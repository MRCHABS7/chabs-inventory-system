import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorRate: number;
  userInteractions: number;
  pageViews: number;
  lastUpdated: Date;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
}

export default function PerformanceMonitor({ showDetails = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    errorRate: 0,
    userInteractions: 0,
    pageViews: 0,
    lastUpdated: new Date()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(collectMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const collectMetrics = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;
    
    setMetrics({
      loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      renderTime: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
      networkLatency: navigation ? navigation.responseStart - navigation.requestStart : 0,
      errorRate: 0, // Would be tracked separately in a real implementation
      userInteractions: parseInt(localStorage.getItem('chabs_user_interactions') || '0'),
      pageViews: parseInt(localStorage.getItem('chabs_page_views') || '0'),
      lastUpdated: new Date()
    });
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return '✅';
    if (value <= thresholds.warning) return '⚠️';
    return '❌';
  };

  if (!showDetails) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">System Performance</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isExpanded ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-lg font-semibold ${getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}>
              {metrics.loadTime.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-500">Load Time</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 100 })}`}>
              {metrics.memoryUsage}MB
            </div>
            <div className="text-xs text-gray-500">Memory</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {metrics.pageViews}
            </div>
            <div className="text-xs text-gray-500">Page Views</div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Render Time:</span>
                <span className={getStatusColor(metrics.renderTime, { good: 500, warning: 1500 })}>
                  {getStatusIcon(metrics.renderTime, { good: 500, warning: 1500 })} {metrics.renderTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Network Latency:</span>
                <span className={getStatusColor(metrics.networkLatency, { good: 100, warning: 500 })}>
                  {getStatusIcon(metrics.networkLatency, { good: 100, warning: 500 })} {metrics.networkLatency.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>User Interactions:</span>
                <span className="text-blue-600">{metrics.userInteractions}</span>
              </div>
              <div className="flex justify-between">
                <span>Error Rate:</span>
                <span className={getStatusColor(metrics.errorRate, { good: 0, warning: 1 })}>
                  {getStatusIcon(metrics.errorRate, { good: 0, warning: 1 })} {metrics.errorRate}%
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last updated: {metrics.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Load Time</h4>
            <span className="text-lg">{getStatusIcon(metrics.loadTime, { good: 1000, warning: 3000 })}</span>
          </div>
          <div className={`text-2xl font-bold mt-2 ${getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}>
            {metrics.loadTime.toFixed(0)}ms
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: &lt;1000ms
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Memory Usage</h4>
            <span className="text-lg">{getStatusIcon(metrics.memoryUsage, { good: 50, warning: 100 })}</span>
          </div>
          <div className={`text-2xl font-bold mt-2 ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 100 })}`}>
            {metrics.memoryUsage}MB
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: &lt;50MB
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Network Latency</h4>
            <span className="text-lg">{getStatusIcon(metrics.networkLatency, { good: 100, warning: 500 })}</span>
          </div>
          <div className={`text-2xl font-bold mt-2 ${getStatusColor(metrics.networkLatency, { good: 100, warning: 500 })}`}>
            {metrics.networkLatency.toFixed(0)}ms
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: &lt;100ms
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Page Views</h4>
            <span className="text-lg">📊</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-blue-600">
            {metrics.pageViews}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total sessions
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Trends</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Render Time:</span>
              <span className={getStatusColor(metrics.renderTime, { good: 500, warning: 1500 })}>
                {metrics.renderTime.toFixed(0)}ms
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>User Interactions:</span>
              <span className="text-blue-600">{metrics.userInteractions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Error Rate:</span>
              <span className={getStatusColor(metrics.errorRate, { good: 0, warning: 1 })}>
                {metrics.errorRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
          <div className="space-y-2 text-sm">
            {metrics.loadTime > 3000 && (
              <div className="text-red-600">• Optimize bundle size and lazy loading</div>
            )}
            {metrics.memoryUsage > 100 && (
              <div className="text-red-600">• Check for memory leaks</div>
            )}
            {metrics.networkLatency > 500 && (
              <div className="text-yellow-600">• Consider CDN or caching improvements</div>
            )}
            {metrics.loadTime <= 1000 && metrics.memoryUsage <= 50 && (
              <div className="text-green-600">• Performance is optimal! 🎉</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {metrics.lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}