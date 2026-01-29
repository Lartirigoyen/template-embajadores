'use client';

import InputLabel from "./InputLabel";
import { InputMessage } from "./InputMessage";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelPosition?: 'top' | 'left';
  helperText?: string;
  fullWidth?: boolean;
  error?: string;
  touched?: boolean;
}

export const TextArea = ({ 
  label, 
  labelPosition = 'top',
  helperText, 
  fullWidth = false,
  id,
  disabled = false,
  required,
  error,
  touched,
  ...props
}: TextAreaProps) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const hasError = touched && Boolean(error);

  return (
    <div className={`form-field-container ${widthClass}`}>
      <div className={`flex gap-2 ${labelPosition === 'top' ? 'flex-col' : 'flex-row items-center'}`}>
        {label && (
          <InputLabel htmlFor={id} text={label} disabled={disabled} required={required} error={hasError} />
        )}

        <textarea
          id={id}
          name={id}
          disabled={disabled}
          {...props}
          className={`form-input-base form-input-typography px-3 ${hasError ? 'border-input-error' : 'border-input-normal'}`}
        />
      </div>

      {hasError && (
        <InputMessage variant="error" message={error!} />
      )}
      {!hasError && helperText && (
        <InputMessage variant="helper" message={helperText} />
      )}
    </div>
  )
}

export default TextArea;