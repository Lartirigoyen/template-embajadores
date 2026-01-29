'use client';

import { Link as DefaultLink } from './Link';
import Typography from './Typography';

export interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode | string;
  className?: string;
}

export const Breadcrumb = ({
  items,
  separator = '/',
  className = '',
}: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center gap-2 text-base ${className}`} aria-label="breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const LinkTag = DefaultLink;
        return (
          <div key={idx} className="flex items-center gap-2">
            {isLast || item.isCurrent ? (
              <Typography variant='h6' as='span' color='primary' aria-current="page">{item.label}</Typography>
            ) : (
              <LinkTag
                href={item.to || item.href}
                onClick={item.onClick}
                color='gray'
              >
                {item.label}
              </LinkTag>
            )}
            {!isLast && <span className="text-gray-medium select-none">{separator}</span>}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;