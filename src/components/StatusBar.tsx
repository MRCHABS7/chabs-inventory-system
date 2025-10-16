import { useState, useEffect } from 'react';
import { me } from '../lib/auth-simple';
import { listCustomers, listProducts, listQuotations, listOrders } from '../lib/storage-simple';

export default function StatusBar() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    quotations: 0,
    orders: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('online');
  const user = me();

  useEffect(() => {
    // Update stats
    const updateStats = () => {
      setStats({
        customers: listCustomers().length,
        products: listProducts().length,
        quotations: listQuotations().length,
        orders: listOrders().length
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Monitor connection status
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getZoomLevel = () => {
    return Math.round((parseFloat(document.body.style.zoom || '1') * 100));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-1 text-xs z-40">
      <div className="flex items-center justify-between">
        {/* Left side - System status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-gray-600 dark:text-gray-400">
              {connectionStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400">
            Ready
          </div>
          
          <div className="text-gray-600 dark:text-gray-400">
            User: {user?.email || 'Guest'}
          </div>
        </div>

        {/* Center - Quick stats */}
        <div className="flex items-center space-x-6">
          <span className="text-gray-600 dark:text-gray-400">
            Customers: {stats.customers}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Products: {stats.products}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Quotes: {stats.quotations}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Orders: {stats.orders}
          </span>
        </div>

        {/* Right side - System info */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-400">
            Zoom: {getZoomLevel()}%
          </span>
          
          <span className="text-gray-600 dark:text-gray-400">
            {currentTime.toLocaleTimeString()}
          </span>
          
          <span className="text-gray-600 dark:text-gray-400">
            {currentTime.toLocaleDateString()}
          </span>
          
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400">
              CHABS v2.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}