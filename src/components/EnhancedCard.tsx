import React from 'react';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  onClick?: () => void;
}

export default function EnhancedCard({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  shadow = 'md',
  border = true,
  onClick 
}: EnhancedCardProps) {
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `
    bg-white rounded-lg 
    ${shadowClasses[shadow]}
    ${border ? 'border border-gray-200' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
    ${hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}