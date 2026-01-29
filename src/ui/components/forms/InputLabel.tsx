'use client';

import Typography from "../Typography";

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const InputLabel = ({ text, required, disabled, error, className, ...props }: InputLabelProps) => {
  return (
    <label {...props} className={`flex items-center gap-1 ${className} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <Typography variant="label" as="span" color={error ? "error" : undefined} className="text-left">{text}</Typography>
      {required && <Typography as="span" color="error">*</Typography>}
    </label>
  )
}

export default InputLabel;