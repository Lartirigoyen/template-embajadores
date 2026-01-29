'use client';

import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import Button from "./Button";
import Typography from "./Typography";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  title,
  children,
  footer,
  size = 'md'
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center" role="dialog">
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity bg-accent/30 backdrop-blur-sm z-0"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        className={`relative z-10 p-4 flex flex-col gap-4 bg-white rounded-lycsa text-left shadow-lycsa-lg transform transition-all w-full ${sizeClasses[size]}`}
      >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between pb-2 border-b border-gray-medium bg-white">
              <Typography variant="h3">{title}</Typography>
              <Button
                type="button"
                onClick={onClose}
                icon={<IconX className="w-6 h-6" />}
                variant="text"
                color="gray"
                aria-label="Cerrar modal"
              />
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="pt-2border-t border-gray-medium">
              {footer}
            </div>
          )}
      </div>
    </div>
  );
}

export default Modal;