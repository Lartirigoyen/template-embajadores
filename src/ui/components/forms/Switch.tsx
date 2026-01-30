'use client';

import { InputLabel } from "./InputLabel";
import InputMessage from "./InputMessage";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'right' | 'left';
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  error?: string;
  helperText?: string;
}

export const Switch = ({
  checked = false,
  onChange,
  label,
  labelPosition = 'right',
  required = false,
  disabled = false,
  size = 'md',
  error,
  helperText
}: SwitchProps) => {
  const sizes = {
    sm: { width: 36, height: 20, circle: 16 },
    md: { width: 44, height: 24, circle: 20 },
    lg: { width: 52, height: 28, circle: 24 },
    xl: { width: 60, height: 32, circle: 28 },
  };

  const { width, height, circle } = sizes[size];

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div className="form-field-container">
      <div className={`flex items-center gap-2 ${labelPosition === 'right' ? 'flex-row' : 'flex-row-reverse'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
        onClick={handleClick}
      >
        <div className={`relative ${checked ? 'bg-primary-800' : 'bg-gray-medium'} transition-colors duration-300`}
          style={{
            width,
            height,
            borderRadius: height / 2
          }}
        >
          <div className='absolute bg-white rounded-full shadow-lycsa-md'
            style={{
              width: circle,
              height: circle,
              top: (height - circle) / 2,
              left: checked ? width - circle - (height - circle) / 2 : (height - circle) / 2,
              transition: 'left 0.3s',
            }}
          />
        </div>
        {label && (
          <InputLabel text={label} disabled={disabled} required={required} />
        )}
      </div>
      {error && (
        <InputMessage variant="error" message={error} />
      )}
      {!error && helperText && (
        <InputMessage variant="helper" message={helperText} />
      )}
    </div>
  );
};

export default Switch;