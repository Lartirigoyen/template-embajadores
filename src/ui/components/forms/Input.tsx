'use client';
import InputLabel from "./InputLabel";
import InputMessage from "./InputMessage";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelPosition?: 'top' | 'left';
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  touched?: boolean;
}

export const Input = ({ 
  label, 
  labelPosition = 'top',
  helperText, 
  fullWidth = false,
  id,
  disabled = false,
  required,
  icon,
  iconPosition = 'left',
  error,
  touched,
  ...props
}: InputProps) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const hasError = touched && Boolean(error);

  return (
    <div className={`form-field-container ${widthClass}`}>
      <div className={`flex gap-2 ${labelPosition === 'top' ? 'flex-col' : 'flex-row items-center'}`}>
        {label && (
          <InputLabel htmlFor={id} text={label} disabled={disabled} required={required} error={hasError} />
        )}

        <div className={`flex-1 relative`}>
          <div className={`absolute ${iconPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-accent w-4 h-4 flex items-center justify-center`}>
            {icon}
          </div>
          <input
            id={id}
            name={id}
            type="text"
            disabled={disabled}
            {...props}
            className={`form-input-base form-input-typography ${
                hasError ? 'border-input-error' : 'border-input-normal'
              } ${
                icon ? (iconPosition === 'left' ? 'pl-10 pr-3' : 'pl-3 pr-10') : 'px-3'
              }`}
          />
        </div>
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

export default Input;