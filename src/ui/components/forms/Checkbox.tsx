'use client';

import { IconCheck } from "@tabler/icons-react";
import InputMessage from "./InputMessage";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  variant?: "plain" | "boxed",
  error?: string;
  touched?: boolean;
}

export const Checkbox = ({ 
  id, 
  label, 
  description, 
  required,
  checked = false, 
  onChange, 
  disabled = false,
  variant = "plain",
  error,
  touched,
  ...props
}: CheckboxProps) => {
  const hasError = touched && Boolean(error);
  const boxClass = hasError ? 'form-box-error' : variant === 'boxed' ? 'form-box-boxed' : 'form-box-plain';

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex flex-col gap-1 text-accent ${boxClass}`}>
        <div className="flex items-center gap-2 select-none">
          <div className="relative flex items-center justify-center">
            <input
              id={id}
              name={id}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              {...props}
              className="peer appearance-none size-5 bg-white border border-gray-medium rounded checked:bg-primary-800 checked:border-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <IconCheck 
              stroke={4} 
              className="pointer-events-none absolute text-white size-4 opacity-0 transition-opacity peer-checked:opacity-100" />
          </div>
          {label && (
            <InputLabel htmlFor={id} text={label} disabled={disabled} required={required} error={hasError} />
          )}
        </div>
        {description && (
          <div className="pl-7">
            <Typography variant="caption" as="p">{description}</Typography>
          </div>
        )}
      </div>
      {hasError && (
        <InputMessage variant="error" message={error!} />
      )}
    </div>
  )
}

export default Checkbox;