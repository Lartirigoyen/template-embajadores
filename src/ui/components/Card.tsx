'use client';

import Typography from "./Typography";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  classNameContainer?: string;
  classNameHeader?: string;
  classNameTitle?: string;
  classNameSubtitle?: string;
  classNameFooter?: string;
}

export const Card = ({
  children,
  title,
  subtitle,
  footer,
  classNameContainer = '',
  classNameHeader = '',
  classNameTitle = '',
  classNameSubtitle = '',
  classNameFooter = ''
}: CardProps) => {
  return (
    <div
      className={`h-max flex flex-col gap-4 p-4 bg-white rounded-lycsa shadow-lycsa-md max-w-full ${classNameContainer}`}
      style={{ position: 'relative' }}
    >
      {(title || subtitle) && (
        <div className={`flex flex-col items-start text-left gap-2 pb-2 border-b border-gray-medium ${classNameHeader}`}>        
          {title && <Typography variant="h4" as="h4" className={classNameTitle}>{title}</Typography>}
          {subtitle && <Typography variant="paragraph" as="p" className={classNameSubtitle}>{subtitle}</Typography>}
        </div>
      )}
      <div className="w-full">{children}</div>
      {footer && (
        <div className={`border-t border-gray-200 ${classNameFooter}`}>{footer}</div>
      )}
    </div>
  );
}

export default Card;