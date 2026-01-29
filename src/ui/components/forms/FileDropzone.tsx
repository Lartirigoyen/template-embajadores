'use client';

import { IconTrash, IconUpload } from "@tabler/icons-react";
import { useRef } from "react";
import Typography from "../Typography";
import { Button } from "../Button";
import { InputMessage } from "./InputMessage";
import { InputLabel } from "./InputLabel";

interface FileDropzoneProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept: string;
  value: File[];
  error?: string;
  onChange: (files: File[]) => void;
  onClear?: (index?: number) => void;
}

export const FileDropzone = ({ label, required = false, disabled = false, multiple = false, accept, value, error, onChange, onClear }: FileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleOpen = () => inputRef.current?.click();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange(files);
  };

  const handleClear = (index: number) => {
    if (index === undefined) return;

    onChange(value.filter((_, i) => i !== index));
    onClear?.(index);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <InputLabel text={label} disabled={disabled} required={required} />
      )}

      <div
        onClick={() => !disabled && handleOpen()}
        className="flex items-center justify-center p-8 rounded-lycsa border-2 border-dashed border-gray-medium cursor-pointer select-none"
        aria-label="Zona para arrastrar y soltar archivos"
        >
        <div className="flex flex-col items-center gap-1 w-full text-center text-sm text-gris-oscuro">
          <IconUpload className='size-10 text-primary-800' />
          <Typography variant="paragraph" as="p">Arrastrá y soltá aquí</Typography>
          <Typography variant="paragraph" as="p">o</Typography>
          <div className="border border-primary-800 py-2 px-4 rounded-lycsa hover:bg-primary-50">
            <Typography variant="paragraph" as="span" color="primary">
              selecciona {multiple ? 'archivos' : 'un archivo'}
            </Typography>
          </div>
        </div>
        <input 
          ref={inputRef}
          type="file" 
          name="file" 
          id="file" 
          onChange={onInputChange} 
          accept={accept} 
          multiple={multiple} 
          className='hidden' 
        />
      </div>

      <div className={`flex items-center gap-2`}>
        {error ? (
          <InputMessage variant="error" message={error} />
        ) : (
          <InputMessage variant="helper" message={`Extensión de archivo permitida: ${accept}`} />
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          {(!multiple ? value.slice(0, 1) : value).map((file, index) => (
            <div key={index} className="flex items-center justify-between gap-2 bg-gray-light p-2 rounded-lycsa">
              <div className="flex flex-col gap-1">
                <Typography variant="paragraph" as="p">{file.name}</Typography>
                <Typography variant="caption" as="p">{(file.size / 1024).toFixed(1)} KB</Typography>
              </div>
              <Button
                type="button"
                onClick={() => handleClear(index)}
                icon={<IconTrash />}
                variant="outline"
                color="error"
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileDropzone;