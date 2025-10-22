import type { User } from './types';

// Simple localStorage-based auth for demo
const STORAGE_KEY = 'chabs_session';

export const login = (email: string, password: string, role: User['role']): boolean => {
  // For demo: accept any non-empty credentials
  if (!email.trim() || !password.trim()) {
    return false;
  }
  
  const user: User = { 
    id: `user_${Date.now()}`, // Generate unique ID
    email, 
    password: '', // Don't store password
    role,
    firstName: email.split('@')[0],
    lastName: '',
    permissions: role === 'admin' ? ['all'] : ['warehouse'],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      // Set session timestamp
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