import { v4 as uuid } from 'uuid';
import type { Notification } from './types';

const NOTIFICATIONS_KEY = 'chabs_notifications';

// Get all notifications
export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch {
    return [];
  }
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: uuid(),
    timestamp: new Date().toISOString(),
    read: false
  };

  const notifications = getNotifications();
  const updatedNotifications = [newNotification, ...notifications].slice(0, 100); // Keep only last 100
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  }

  return newNotification;
};

// Mark notification as read
export const markAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  }
};

// Mark all notifications as read
export const markAllAsRead = (): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  }
};

// Get unread count
export const getUnreadCount = (): number => {
  return getNotifications().filter(n => !n.read).length;
};

// Clear all notifications
export const clearAllNotifications = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  }
};

// Warehouse-specific notification helpers
export const notifyLowStock = (productName: string, currentStock: number, minStock: number) => {
  addNotification({
    type: 'warning',
    title: 'Low Stock Alert',
    message: `${productName} is running low (${currentStock} remaining, minimum: ${minStock})`,
    category: 'warehouse',
    actionUrl: '/warehouse'
  });
};

export const notifyStockOut = (productName: string) => {
  addNotification({
    type: 'error',
    title: 'Stock Out Alert',
    message: `${productName} is out of stock`,
    category: 'warehouse',
    actionUrl: '/warehouse'
  });
};

export const notifyStockMovement = (productName: string, type: 'in' | 'out' | 'adjustment', quantity: number) => {
  const typeText = type === 'in' ? 'received' : type === 'out' ? 'shipped' : 'adjusted';
  addNotification({
    type: 'info',
    title: 'Stock Movement',
    message: `${productName}: ${quantity} units ${typeText}`,
    category: 'warehouse',
    actionUrl: '/warehouse'
  });
};

export const notifyOrderStatusChange = (orderNumber: string, oldStatus: string, newStatus: string) => {
  addNotification({
    type: 'info',
    title: 'Order Status Update',
    message: `Order ${orderNumber} changed from ${oldStatus} to ${newStatus}`,
    category: 'orders',
    actionUrl: '/orders'
  });
};

export const notifyNewOrder = (orderNumber: string, customerName: string) => {
  addNotification({
    type: 'success',
    title: 'New Order Received',
    message: `Order ${orderNumber} from ${customerName}`,
    category: 'orders',
    actionUrl: '/orders'
  });
};

export const notifyInventoryReorder = (productName: string, quantity: number, supplierName: string) => {
  addNotification({
    type: 'info',
    title: 'Automatic Reorder',
    message: `Ordered ${quantity} units of ${productName} from ${supplierName}`,
    category: 'inventory',
    actionUrl: '/purchase-orders'
  });
};

// External Processing Notifications
export const notifyExternalProcessingSent = (productName: string, supplierName: string, orderNumber: string) => {
  addNotification({
    type: 'info',
    title: 'Sent for External Processing',
    message: `${productName} sent to ${supplierName} (Order: ${orderNumber})`,
    category: 'external_processing',
    actionUrl: '/external-processing',
    priority: 'medium'
  });
};

export const notifyExternalProcessingCompleted = (productName: string, supplierName: string, orderNumber: string) => {
  addNotification({
    type: 'success',
    title: 'External Processing Complete',
    message: `${productName} completed by ${supplierName} (Order: ${orderNumber})`,
    category: 'external_processing',
    actionUrl: '/external-processing',
    priority: 'high'
  });
};

export const notifyExternalProcessingOverdue = (productName: string, supplierName: string, daysPastDue: number) => {
  addNotification({
    type: 'warning',
    title: 'External Processing Overdue',
    message: `${productName} at ${supplierName} is ${daysPastDue} days overdue`,
    category: 'external_processing',
    actionUrl: '/external-processing',
    priority: 'high'
  });
};

export const notifyExternalProcessingRejected = (productName: string, supplierName: string, reason: string) => {
  addNotification({
    type: 'error',
    title: 'External Processing Rejected',
    message: `${productName} rejected by ${supplierName}: ${reason}`,
    category: 'external_processing',
    actionUrl: '/external-processing',
    priority: 'critical'
  });
};

// System Health Notifications
export const notifySystemHealth = (component: string, status: 'healthy' | 'warning' | 'error', message: string) => {
  addNotification({
    type: status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : 'error',
    title: `System Health: ${component}`,
    message,
    category: 'system',
    priority: status === 'error' ? 'critical' : status === 'warning' ? 'high' : 'low',
    autoExpire: status === 'healthy',
    expiresAt: status === 'healthy' ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : undefined
  });
};

// Automated Alert System
export const checkAndNotifyInventoryAlerts = () => {
  // This would be called periodically to check inventory levels
  // Implementation would check products and generate notifications
};

export const checkAndNotifyExternalProcessingAlerts = () => {
  // This would be called periodically to check external processing orders
  // Implementation would check overdue orders and generate notifications
};