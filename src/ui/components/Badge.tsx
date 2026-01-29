'use client';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' |'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) => {
  const variantClasses = {
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    error: 'bg-error text-white',
    info: 'bg-info-light text-info-dark',
    secondary: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
  };

  const sizeClasses = {
    xs: 'px-1 py-1 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  return (
    <span
      className={`inline-flex justify-center items-center font-aller-bold rounded-full w-max ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;