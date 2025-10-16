import type { User } from './types';

// Simple localStorage-based auth for demo
const STORAGE_KEY = 'chabs_session';

export const login = (email: string, password: string, role: User['role']): boolean => {
  // For demo: accept any non-empty credentials
  if (!email.trim() || !password.trim()) {
    return false;
  }
  
  const user: User = { 
    id: email, // Use email as ID for simplicity
    email, 
    password: '', // Don't store password
    role,
    firstName: '',
    lastName: '',
    permissions: [],
    createdAt: new Date().toISOString()
  };
  
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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
    
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};