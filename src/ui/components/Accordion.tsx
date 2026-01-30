'use client';

import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import Typography from './Typography';

export interface AccordionItem {
  id: string;
  summary: React.ReactNode;
  details: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultExpanded?: string | string[];
  expanded?: string | string[];
  onChange?: (expandedIds: string[]) => void;
  multiple?: boolean;
  variant?: 'default' | 'outlined' | 'elevation';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Accordion = ({
  items,
  defaultExpanded,
  expanded: controlledExpanded,
  onChange,
  multiple = false,
  variant = 'default',
  size = 'md',
  className = '',
}: AccordionProps) => {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (defaultExpanded) {
      return Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
    }
    return [];
  });

  const expandedIds = controlledExpanded !== undefined
    ? (Array.isArray(controlledExpanded) ? controlledExpanded : [controlledExpanded])
    : internalExpanded;

  const handleToggle = (id: string, disabled?: boolean) => {
    if (disabled) return;

    let newExpanded: string[];

    if (multiple) {
      newExpanded = expandedIds.includes(id)
        ? expandedIds.filter((item) => item !== id)
        : [...expandedIds, id];
    } else {
      newExpanded = expandedIds.includes(id) ? [] : [id];
    }

    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }

    onChange?.(newExpanded);
  };

  const variantStyles = {
    default: 'border-b border-gray-medium',
    outlined: 'border border-gray-medium rounded-lycsa',
    elevation: 'shadow-lycsa-md rounded-lycsa bg-white',
  };

  const sizeStyles = {
    sm: { padding: 'px-3 py-2', iconSize: 'w-4 h-4' },
    md: { padding: 'px-4 py-3', iconSize: 'w-5 h-5' },
    lg: { padding: 'px-5 py-4', iconSize: 'w-6 h-6' },
  };

  const { padding, iconSize } = sizeStyles[size];

  return (
    <div className={`w-full ${className} flex flex-col ${variant === 'default' ? '' : 'gap-2'}`}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className={`${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''}`}
          >
            {/* Summary / Header */}
            <div
              onClick={() => handleToggle(item.id, isDisabled)}
              className={`w-full flex items-center justify-between gap-2 ${padding} text-left transition-colors duration-300 
                ${variant !== "default" ? 'rounded-lycsa' : ''} 
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-light'}
              `}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {item.icon && (
                  <div className={`flex items-center justify-center ${iconSize} text-accent`}>
                    {item.icon}
                  </div>
                )}
                <div className="flex-1">
                  {typeof item.summary === 'string' ? (
                    <Typography variant="h6" as="span">{item.summary}</Typography>
                  ) : (
                    item.summary
                  )}
                </div>
              </div>
              <IconChevronDown
                className={`${iconSize} text-accent transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>

            {/* Details / Content */}
            <div
              id={`accordion-content-${item.id}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-labelledby={`accordion-header-${item.id}`}
            >
              <div className={`${padding}`}>
                {typeof item.details === 'string' ? (
                  <Typography variant="paragraph" as="p">{item.details}</Typography>
                ) : (
                  item.details
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;