'use client';

import Typography from "../Typography";
import InputLabel from "./InputLabel";
import InputMessage from "./InputMessage";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  labelPosition?: 'top' | 'left';
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  variant?: "plain" | "boxed",
  error?: string;
  touched?: boolean;
}

export const RadioGroup = ({
  label,
  labelPosition = 'top',
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  direction = 'horizontal',
  variant = "plain",
  error,
  touched
}: RadioGroupProps) => {
  const hasError = touched && Boolean(error);

  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  return (
    <div className="form-field-container">
      <div className={`flex gap-2 ${labelPosition === 'top' ? 'flex-col' : 'flex-row items-center'}`}>
        {label && (
          <InputLabel text={label} disabled={disabled} required={required} error={hasError} />
        )}

        <div className={`flex ${direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-4'} ${hasError ? 'form-box-error' : ''}`}>
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <label
                key={option.value}
                className={`h-max flex flex-col justify-center gap-1 text-accent ${variant === 'boxed' ? 'form-box-boxed' : 'form-box-plain'} 
                  ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                onClick={() => handleChange(option.value)}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className={`
                    w-5 h-5 min-w-5 min-h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? 'border-primary-800' : 'border-gray-dark'}
                  `}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-800" />
                    )}
                  </div>
                  <span className={`font-aller text-base`}>
                    {option.label}
                  </span>
                </div>
                {option.description && (
                  <div className="pl-7">
                    <Typography variant="caption" as="p">{option.description}</Typography>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {hasError && (
        <InputMessage variant="error" message={error!} />
      )}
    </div>
  );
};

export default RadioGroup;