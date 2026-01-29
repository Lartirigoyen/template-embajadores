'use client';

import { useRef, useEffect } from 'react';

interface MenuProps {
  id?: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right' | 'center';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right' | 'center';
  };
  'aria-labelledby'?: string;
}

export const Menu = ({
  id,
  anchorEl,
  open,
  onClose,
  children,
  className,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  'aria-labelledby': ariaLabelledby,
}: MenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  
  let top = rect.top;
  let left = rect.left;

  if (anchorOrigin.vertical === 'bottom') {
    top = rect.bottom;
  }

  if (anchorOrigin.horizontal === 'right') {
    left = rect.right;
  } else if (anchorOrigin.horizontal === 'center') {
    left = rect.left + rect.width / 2;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 1300,
  };

  if (transformOrigin.horizontal === 'right') {
    style.transform = 'translateX(-100%)';
  } else if (transformOrigin.horizontal === 'center') {
    style.transform = 'translateX(-50%)';
  }

  return (
    <div
      id={id}
      ref={menuRef}
      aria-labelledby={ariaLabelledby}
      className={`min-w-50 bg-white rounded-lycsa shadow-lg border border-gray-light p-1 mt-1 ${className || ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Menu;