'use client';

import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX, IconXboxX } from '@tabler/icons-react';
import { createContext, useContext, useState, useCallback } from 'react';
import { Button } from './Button';
import { Typography } from './Typography';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-center'
    | 'center'
    | 'right-center';
}

export const ToastProvider = ({ children, position = 'bottom-right' }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'], duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} position={position} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-center'
    | 'center'
    | 'right-center';
}

const positionClasses = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'left-center': 'top-1/2 left-4 -translate-y-1/2 items-start',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center',
  'right-center': 'top-1/2 right-4 -translate-y-1/2 items-end',
};

const ToastContainer = ({ toasts, onRemove, position = 'bottom-right' }: ToastContainerProps) => {
  return (
    <div className={`fixed z-100 space-y-2 flex flex-col ${positionClasses[position]}`}
      style={{ minWidth: 250 }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const typeStyles = {
    success: 'bg-success-light border-success text-success-dark',
    error: 'bg-error-light border-error text-error-dark',
    warning: 'bg-warning-light border-warning text-warning-dark',
    info: 'bg-info-light border-info text-info-dark',
  };

  const icons = {
    success: <IconCircleCheck className='size-4' />,
    error: <IconXboxX className='size-4' />,
    warning: <IconAlertTriangle className='size-4' />,
    info: <IconInfoCircle className='size-4' />,
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lycsa border-l-4 shadow-lycsa-sm min-w-75 max-w-md animate-slide-in ${typeStyles[toast.type]}`}
    >
      {icons[toast.type]}
      <Typography variant='paragraph-sm' as="p" className='flex-1'>{toast.message}</Typography>
      <Button 
        type='button' 
        variant='text'
        color={toast.type}
        onClick={() => onRemove(toast.id)}
        icon={<IconX className='size-4' />}
      />
    </div>
  );
}