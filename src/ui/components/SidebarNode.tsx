'use client';

import { IconChevronDown } from '@tabler/icons-react';
import type { SidebarItem } from './Sidebar';
import Typography from './Typography';

const Option = ({ 
  item, 
  isActive = false, 
  isOpen = false, 
  isMainOption = false, 
  onClick 
}: { 
  item: SidebarItem; 
  isActive?: boolean; 
  isOpen?: boolean; 
  isMainOption?: boolean; 
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 rounded-lycsa px-3 py-2 text-base text-left cursor-pointer ${
        isActive ? "bg-primary-800 text-white" : "text-accent hover:bg-primary-50"
      }`}
    >
      <div className='flex items-center gap-2'>
        {item.icon && (
          <div className={`shrink-0`}>{item.icon}</div>
        )}
        <Typography 
          variant={isActive ? "h6" : "paragraph"} 
          as="span" 
          color={isActive ? "white" : "accent"} 
          className="truncate"
        >
          {item.label}
          </Typography>
      </div>

      {isMainOption && <IconChevronDown className={`${isOpen ? "rotate-180" : ""} transition-transform`} />}
    </div>
  )
}

interface SidebarItemProps {
  item: SidebarItem;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
}

export const SidebarNode = ({ 
  item,
  pathname,
  isOpen,
  onToggle,
  onNavigate
}: SidebarItemProps) => {
  const isGroup = !!item.children?.length && !item.path;
  const isActive = !!item.path && item.path === pathname;

  if (isGroup) {
    return (
      <div className="select-none">
        <Option item={item} isMainOption isOpen={isOpen} onClick={onToggle} />

        <div className={`flex flex-col gap-2 ${!isOpen && "hidden"}`}>
          {item.children!.map((child, index) => {
            const childActive = !!child.path && child.path === pathname;
            return (
              <Option 
                key={index} 
                item={child} 
                isActive={childActive} 
                onClick={() => child.path && onNavigate(child.path)} 
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Item simple (ej: INICIO)
  return (
    <Option 
      item={item} 
      isActive={isActive} 
      onClick={() => item.path && onNavigate(item.path)} 
    />
  );
};

export default SidebarNode;