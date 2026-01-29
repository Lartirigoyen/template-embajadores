'use client';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'contained' | 'outline';
  color?: 'primary' | 'secondary' | 'gray' | 'success' | 'warning' | 'info' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  classNameLabel?: string;
}

export const Button = ({
  variant = 'contained',
  color = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  label,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  classNameLabel = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'h-max inline-flex items-center justify-center gap-2 font-aller-bold uppercase rounded-lycsa transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const colorClasses = {
    contained: {
      primary: 'bg-primary-800 text-white hover:bg-primary-700 focus:ring-primary-800',
      secondary: 'bg-secondary-800 text-white hover:bg-secondary-700 focus:ring-secondary-600',
      gray: 'bg-gray-dark text-white hover:bg-gray-medium focus:ring-gray-dark',
      success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
      warning: 'bg-warning text-white hover:bg-warning-dark focus:ring-warning',
      info: 'bg-info text-white hover:bg-info-dark focus:ring-info',
      error: 'bg-error text-white hover:bg-error-dark focus:ring-error',
    },
    outline: {
      primary: 'border border-primary-800 text-primary-800 hover:bg-primary-100 focus:ring-primary-800',
      secondary: 'border border-secondary-800 text-secondary-800 hover:bg-secondary-100 focus:ring-secondary-600',
      gray: 'border border-gray-dark text-gray-dark hover:bg-gray-light focus:ring-gray-dark',
      success: 'border border-success text-success hover:bg-success-light focus:ring-success',
      warning: 'border border-warning text-warning hover:bg-warning-light focus:ring-warning',
      info: 'border border-info text-info hover:bg-info-light focus:ring-info',
      error: 'border border-error text-error hover:bg-error-light focus:ring-error',
    },
    text: {
      primary: 'text-primary-800 hover:bg-primary-50 focus:ring-primary-800',
      secondary: 'text-secondary-800 hover:bg-secondary-50 focus:ring-secondary-600',
      gray: 'text-accent hover:bg-gray-light focus:ring-gray-dark',
      success: 'text-success hover:bg-success-light focus:ring-success',
      warning: 'text-warning hover:bg-warning-light focus:ring-warning',
      info: 'text-info hover:bg-info-light focus:ring-info',
      error: 'text-error hover:bg-error-light focus:ring-error',
    },
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const widthClass = fullWidth ? 'w-full' : 'w-max';
  
  const variantColorClass = colorClasses[variant]?.[color] || colorClasses.contained.primary;

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantColorClass} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {iconPosition === 'left' && icon && (
        <div className={`flex justify-center items-center ${iconSizeClasses[size]}`}>
          {icon}
        </div>
      )}
      {label && (
        <span className={classNameLabel}>{label}</span>
      )}
      {iconPosition === 'right' && icon && (
        <div className={`flex justify-center items-center ${iconSizeClasses[size]}`}>
          {icon}
        </div>
      )}
    </button>
  );
}

export default Button;