'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variantClasses = {
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    error: 'bg-error-light text-error-dark',
    info: 'bg-info-light text-info-dark',
    default: 'bg-lycsa-beige-200 text-lycsa-beige-900',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-aller-bold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
};
