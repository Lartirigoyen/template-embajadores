'use client';

import Typography from "./Typography";

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
  fullScreen?: boolean;
}

export const Loader = ({ 
  size = 'md', 
  color = 'primary', 
  text, 
  fullScreen = false 
}: LoaderProps) => {
  const sizeClasses = {
    xs: 'size-4',
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16',
    xl: 'size-20',
  };

  const colorClasses = {
    primary: 'text-primary-800',
    secondary: 'text-secondary-500',
    accent: 'text-accent',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg className={`${sizeClasses[size]} animate-spin ${colorClasses[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      {text && (
        <Typography 
          variant={['xs', 'sm'].includes(size) ? 'paragraph-sm' : ['lg', 'xl'].includes(size) ? 'paragraph-lg' : 'paragraph'} 
          as="p" 
          color={color}
        >
          {text}
          </Typography>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;