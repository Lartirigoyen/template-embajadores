'use client';

import { IconChevronDown, IconX } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import Checkbox from './Checkbox';
import Badge from '../Badge';
import Typography from '../Typography';
import { Button } from '../Button';
import { InputMessage } from './InputMessage';
import InputLabel from './InputLabel';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

export const Select = ({
  label,
  labelPosition = 'top',
  options,
  value,
  id,
  onChange,
  placeholder = 'Seleccionar...',
  multiple = false,
  className,
  disabled = false,
  required = false,
  helperText,
  error
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (multiple && Array.isArray(value)) return value;
    if (!multiple && typeof value === 'string') return [value];
    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setSelectedValues(value);
    } else if (!multiple && typeof value === 'string') {
      setSelectedValues([value]);
    }
  }, [value, multiple]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
        //setSearchTerm('');
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange?.(newValues);
      setSearchTerm('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setSearchTerm('');
      setOpen(false);
    }
  };

  const handleRemoveBadge = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return '';
    return options.find((o) => o.value === selectedValues[0])?.label || '';
  };

  const inputValue = !multiple && selectedValues.length > 0 && !searchTerm 
    ? getDisplayText() 
    : searchTerm;

  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (        
    <div className='form-field-container w-full'>
      <div className={`flex gap-2 ${labelPosition === 'top' ? 'flex-col' : 'flex-row items-center'}`}>
        {label && (
          <InputLabel htmlFor={id} text={label} disabled={disabled} required={required} error={!!error} />
        )}
        
        <div
          ref={selectRef}
          className={className}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div
            onClick={() => !disabled && setOpen((o) => !o)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lycsa border select-none transition-all duration-200
            ${error ? 'border-input-error' : 'border-input-normal'}
            ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-light' : 'cursor-pointer'}
            ${open && 'ring-2 ring-primary-800 border-transparent'}`}
          >
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              {multiple && selectedValues.map((val) => {
                const option = options.find((o) => o.value === val);
                return option ? (
                  <Badge key={val} variant="primary" size="sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="">
                        {option.label}
                      </span>
                      <Button 
                        type='button'
                        onClick={(e) => handleRemoveBadge(val, e)}
                        icon={<IconX />}
                        variant="text"
                        color='primary'
                        size="sm"
                      />
                    </div>
                  </Badge>
                ) : null;
              })}
              <input
                id={id}
                name={id}
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchTerm(newValue);
                  if (!multiple && newValue === '' && selectedValues.length > 0) {
                    setSelectedValues([]);
                    onChange?.('');
                  }
                }}
                onFocus={() => !disabled && setOpen(true)}
                onClick={(e) => e.stopPropagation()}
                placeholder={placeholder}
                className="flex-1 min-w-25 outline-none bg-transparent form-input-typography"
                disabled={disabled}
              />
            </div>
            <IconChevronDown className={`text-accent shrink-0 size- transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
          </div>
          {open && !disabled && (
            <div className='absolute top-full left-0 right-0 mt-1 p-1
              rounded-lycsa z-1000 bg-white border border-gray-medium shadow-lycsa-md'
            >
              <div className='max-h-40 overflow-y-auto'>
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2">
                    <Typography variant="paragraph" as="span">No se encontraron resultados</Typography>
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className='flex items-center gap-2 px-3 py-2 cursor-pointer bg-white hover:bg-gray-light'
                      >
                        {multiple && (
                          <Checkbox 
                            id={`select-option-${option.value}`}
                            checked={isSelected} 
                            onChange={() => { return; }}
                          />
                        )}
                        <Typography variant="paragraph" as="span">{option.label}</Typography>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
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

export default Select;