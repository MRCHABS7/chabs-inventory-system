/**
 * Input sanitization utilities
 */

export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email.toLowerCase().trim() : '';
};