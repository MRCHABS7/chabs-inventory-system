import React, { useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { listProducts } from '../lib/storage-simple';

interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

interface InventoryAlertsProps {
  onAlertClick?: (alert: Alert) => void;
}

export default function InventoryAlerts({ onAlertClick }: InventoryAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    generateAlerts();
    const interval = setInterval(generateAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const generateAlerts = () => {
    const products = listProducts();
    const newAlerts: Alert[] = [];

    products.forEach(product => {
      // Low stock alert
      if (product.stock <= product.minimumStock) {
        newAlerts.push({
          id: `low-stock-${product.id}`,
          type: 'low_stock',
          productId: product.id,
          productName: product.name,
          message: `Low stock: ${product.stock} units remaining`,
          severity: product.stock === 0 ? 'critical' : product.stock <= 5 ? 'high' : 'medium',
          createdAt: new Date()
        });
      }

      // Out of stock alert
      if (product.stock === 0) {
        newAlerts.push({
          id: `out-of-stock-${product.id}`,
          type: 'out_of_stock',
          productId: product.id,
          productName: product.name,
          message: 'Out of stock - immediate reorder required',
          severity: 'critical',
          createdAt: new Date()
        });
      }

      // Overstock alert (if stock > maximumStock)
      if (product.stock > product.maximumStock) {
        newAlerts.push({
          id: `overstock-${product.id}`,
          type: 'overstock',
          productId: product.id,
          productName: product.name,
          message: `Overstock: ${product.stock} units (consider reducing orders)`,
          severity: 'low',
          createdAt: new Date()
        });
      }
    });

    setAlerts(newAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Inventory Alerts ({alerts.length})
        </h3>
        {alerts.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>No inventory alerts - everything looks good!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(alert.severity)}`}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h4 className="font-medium">{alert.productName}</h4>
                    <p className="text-sm opacity-90">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {alert.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Critical: {alerts.filter(a => a.severity === 'critical').length}</span>
            <span>High: {alerts.filter(a => a.severity === 'high').length}</span>
            <span>Medium: {alerts.filter(a => a.severity === 'medium').length}</span>
            <span>Low: {alerts.filter(a => a.severity === 'low').length}</span>
          </div>
        </div>
      )}
    </div>
  );
}