/**
 * Input validation utilities
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumeric = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return validateNumeric(value) && num > 0;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateProductData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!validateRequired(data.name)) {
    errors.push('Product name is required');
  }
  
  if (!validateRequired(data.sku)) {
    errors.push('SKU is required');
  }
  
  if (!validatePositiveNumber(data.costPrice?.toString() || '')) {
    errors.push('Valid cost price is required');
  }
  
  if (!validatePositiveNumber(data.sellingPrice?.toString() || '')) {
    errors.push('Valid selling price is required');
  }
  
  return errors;
};