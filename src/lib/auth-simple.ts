import type { User } from './types';

// Simple localStorage-based auth for demo
const STORAGE_KEY = 'chabs_session';

// Predefined users for demo
const DEMO_USERS: User[] = [
  {
    id: 'admin_1',
    email: 'admin@chabs.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    permissions: ['all'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'warehouse_1',
    email: 'warehouse@chabs.com',
    password: 'warehouse123',
    role: 'warehouse',
    firstName: 'Warehouse',
    lastName: 'User',
    permissions: ['warehouse'],
    createdAt: new Date().toISOString()
  }
];

export const login = (email: string, password: string): boolean => {
  if (!email.trim() || !password.trim()) {
    return false;
  }
  
  // Find matching user
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return false;
  }
  
  // Create session user (without password)
  const sessionUser: User = {
    ...user,
    password: '', // Don't store password in session
    lastLogin: new Date().toISOString()
  };
  
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      localStorage.setItem('chabs_session_time', Date.now().toString());
    }
    return true;
  } catch {
    return false;
  }
};

export const logout = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore errors
  }
};

export const me = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const user = JSON.parse(stored) as User;
    
    // Validate session is still valid
    if (!user || !user.email || !user.role) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return user;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return me() !== null;
};

export const getSession = () => {
  return me();
};