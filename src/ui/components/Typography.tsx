'use client';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'label' | 'paragraph' | 'paragraph-lg' | 'paragraph-sm' | 'caption' | 'micro';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'error' | 'success' | 'warning' | 'info' | 'gray' | 'helper';
  align?: 'left' | 'right' | 'center';
}

export const Typography = ({ 
  children, 
  variant = 'paragraph', 
  className = '',
  as,
  color = 'accent',
  align = 'left'
}: TypographyProps) => {
  const variantStyles = {
    h1: 'font-aller-bold text-4xl',
    h2: 'font-aller-bold text-3xl',
    h3: 'font-aller-bold text-2xl',
    h4: 'font-aller-bold text-xl',
    h5: 'font-aller-bold text-lg',
    h6: 'font-aller-bold text-base',
    h7: 'font-aller-bold text-sm',
    paragraph: 'font-aller text-base',
    'paragraph-lg': 'font-aller text-lg',
    'paragraph-sm': 'font-aller text-sm',
    caption: 'font-aller-light text-sm',
    micro: 'font-aller-light text-xs',
    label: 'font-aller-bold text-base whitespace-nowrap',
  };

  const colorStyles = {
    primary: 'text-primary-800',
    secondary: 'text-secondary-800',
    accent: 'text-accent',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    gray: 'text-gray-dark',
    helper: 'text-gray-medium',
    white: 'text-white'
  };

  // Mapeo de variant a elemento HTML
  const defaultElements: Record<string, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    paragraph: 'p',
    'paragraph-lg': 'p',
    'paragraph-sm': 'p',
    caption: 'span',
    micro: 'span',
    label: 'label'
  };

  const Component = as || defaultElements[variant] || 'p';
  const alignStyle = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  const styles = `${variantStyles[variant]} ${colorStyles[color]} ${alignStyle} ${className}`;

  return <Component className={styles}>{children}</Component>;
};

export default Typography;