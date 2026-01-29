'use client';

import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconXboxX, IconX } from "@tabler/icons-react";
import Button from "./Button";
import Typography from "./Typography";

export interface AlertProps {
  message?: string;
  detail?: string;
  type: 'error' | 'info' | 'success' | 'warning';
  onClose?: () => void;
  classNameContainer?: string;
  classNameIcon?: string;
  classNameMessage?: string;
  classNameDetail?: string;
}

export const Alert = ({ message, detail, type, onClose, classNameContainer, classNameIcon, classNameMessage, classNameDetail }: AlertProps) => {
  const typeStyles = {
    error: {
      container: 'bg-error-light border-error text-error',
      icon: 'text-error'
    },
    success: {
      container: 'bg-success-light border-success text-success',
      icon: 'text-success'
    },
    warning: {
      container: 'bg-warning-light border-warning text-warning',
      icon: 'text-warning'
    },
    info: {
      container: 'bg-info-light border-info text-info',
      icon: 'text-info'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className={`flex items-center gap-3 rounded-lg p-2 w-full border-l-4 ${styles.container} ${classNameContainer || ''}`}>
      <div className={`shrink-0 ${styles.icon}`}>
        {type === 'error' 
          ? <IconXboxX className={`w-6 h-6 ${classNameIcon || ''}`} />
          : type === 'warning'
          ? <IconAlertTriangle className={`w-6 h-6 ${classNameIcon || ''}`} />
          : type === 'info' 
          ? <IconInfoCircle className={`w-6 h-6 ${classNameIcon || ''}`} />
          : <IconCircleCheck className={`w-6 h-6 ${classNameIcon || ''}`} />
        }
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {message && <Typography variant="h6" as="p" color={type} className={classNameMessage || ''}>{message}</Typography>}
        {detail && <Typography variant="paragraph-sm" as="p" color={type} className={classNameDetail || ''}>{detail}</Typography>}
      </div>

      {onClose && (
        <Button 
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          variant="text"
          color={type}
          icon={<IconX className="w-5 h-5" />}
          size="md"
          className="self-start"
        />
      )}
    </div>
  );
}

export default Alert;