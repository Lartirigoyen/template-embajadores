'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`bg-white rounded-lycsa shadow-lycsa border border-gray-200 ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          {title && <h3 className="text-xl font-aller-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm font-aller-light text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className={`border-t border-gray-200 ${paddingClasses[padding]} bg-gray-50`}>
          {footer}
        </div>
      )}
    </div>
  );
};
