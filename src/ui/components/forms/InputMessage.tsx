'use client';

import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import Typography from "../Typography";

interface InputMessageProps {
  variant?: 'error' | 'helper';
  message: string;
}

export const InputMessage = ({ 
  variant = 'helper',
  message
 }: InputMessageProps) => {

  const messageColor = {
    error: 'text-error',
    helper: 'text-gray-medium'
  }

  const icon = variant === 'error' 
  ? <IconExclamationCircle className={`size-4 ${messageColor[variant]}`} /> 
  : <IconInfoCircle className={`size-4 ${messageColor[variant]}`} />;

  return (
    <div className="flex items-center justify-start gap-1">
      {icon}
      <Typography variant="micro" as="span" color={variant}>{message}</Typography>
    </div>
  )
}

export default InputMessage;