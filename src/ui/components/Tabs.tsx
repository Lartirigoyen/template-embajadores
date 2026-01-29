'use client';

import { useState } from 'react';
import Badge from './Badge';

export interface TabItem {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: 'line' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  centered?: boolean;
  vertical?: boolean;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  tabsClassName?: string;
  contentClassName?: string;
}

export const Tabs = ({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  centered = false,
  vertical = false,
  iconPosition = 'left',
  tabsClassName = '',
  contentClassName = '',
}: TabsProps) => {
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || items[0]?.key
  );

  const activeKey = controlledActiveKey ?? internalActiveKey;

  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeTab = items.find((item) => item.key === activeKey);

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const badgeSize: { [key in 'sm' | 'md' | 'lg']: 'xs' | 'sm' | 'md' } = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  }

  const getVariantClasses = (isActive: boolean, disabled?: boolean) => {
    if (disabled) {
      return 'opacity-40 cursor-not-allowed';
    }

    const baseClasses = 'cursor-pointer transition-all duration-200';

    if (vertical) {
      return `${baseClasses} ${
          isActive
            ? 'font-aller-bold text-primary-800 border-r-2 border-primary-800'
            : 'font-aller text-accent hover:text-primary-700 border-r-2 border-transparent'
        }`;
    }

    switch (variant) {
      case 'line':
        return `${baseClasses} ${
          isActive
            ? 'font-aller-bold text-primary-800 border-b-2 border-primary-800'
            : 'font-aller text-accent hover:text-primary-700 border-b-2 border-transparent'
        }`;
      case 'enclosed':
        return `${baseClasses} border ${
          isActive
            ? 'font-aller-bold bg-white text-primary-800 border-gray-medium border-b-transparent'
            : 'font-aller text-accent hover:bg-primary-50 border-transparent'
        } rounded-t-lycsa`;
      default:
        return baseClasses;
    }
  };

  const getIconLayout = () => {
    if (iconPosition === 'top' || iconPosition === 'bottom') {
      return 'flex-col';
    }
    return 'flex-row';
  };

  const tabListClasses = `
    flex gap-2
    ${vertical ? 'flex-col border-r border-gray-medium' : 'flex-row border-b border-gray-medium'}
    ${centered && !vertical ? 'justify-center' : ''}
    ${fullWidth && !vertical ? 'w-full' : ''}
    ${tabsClassName}
  `.trim();

  const tabClasses = (item: TabItem) => `
    ${sizeClasses[size]}
    ${getVariantClasses(activeKey === item.key, item.disabled)}
    ${fullWidth && !vertical ? 'flex-1 text-center' : ''}
    flex items-center justify-center gap-2
    ${getIconLayout()}
    ${iconPosition === 'right' ? 'flex-row-reverse' : ''}
    ${iconPosition === 'bottom' ? 'flex-col-reverse' : ''}
  `.trim();

  return (
    <div className={`flex gap-4 ${vertical ? 'flex-row' : 'flex-col'}`}>
      <div className={tabListClasses} role="tablist">
        {items.map((item) => (
          <div
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            aria-disabled={item.disabled}
            tabIndex={item.disabled ? -1 : 0}
            className={tabClasses(item)}
            onClick={() => handleTabClick(item.key, item.disabled)}
          >
            {item.icon && (
              <div className={`flex justify-center items-center ${iconSizeClasses[size]}`}>
                {item.icon}
              </div>
            )}
            {item.label && <span>{item.label}</span>}
            {item.badge !== undefined && (
              <Badge
                variant='info'
                size={badgeSize[size]}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div
        role="tabpanel"
        className={`${vertical ? 'flex-1' : ''} ${contentClassName}`}
      >
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;