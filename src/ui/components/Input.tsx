'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-sm font-aller-bold text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            block px-3 py-2 border rounded-lycsa font-aller
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-lycsa-verde-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error' : 'border-gray-300'}
            ${widthClass}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error font-aller">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 font-aller-light">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
