/**
 * Error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const handleError = (error: unknown, context?: string): AppError => {
  console.error(`Error in ${context || 'unknown context'}:`, error);
  
  if (error instanceof Error) {
    return {
      message: error.message,
      severity: 'medium'
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    severity: 'medium'
  };
};

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const safeLocalStorageGet = (key: string, fallback: string = ''): string => {
  try {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};