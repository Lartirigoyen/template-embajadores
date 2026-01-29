'use client';

import { forwardRef } from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: 'none' | 'hover' | 'always';
  color?: 'primary' | 'secondary' | 'inherit' | 'gray';
  component?: React.ElementType;
  to?: string;
}

export const Link = forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ underline = 'hover', color = 'primary', component, to, className = '', children, ...props }, ref) => {
  const Comp = component || 'a';
  const underlineClass =
    underline === 'always'
      ? 'underline'
      : underline === 'hover'
      ? 'hover:underline'
      : 'no-underline';
  const colorClass =
    color === 'primary'
      ? 'text-primary-800 hover:text-primary-700'
      : color === 'secondary'
      ? 'text-secondary-800 hover:text-secondary-700'
      : color === 'gray'
      ? 'text-gray-dark hover:text-gray-medium'
      : 'text-inherit';

  return (
    <Comp
      ref={ref as any}
      href={to || props.href}
      className={`font-aller transition-colors ${underlineClass} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
});

export default Link;