import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Input from '../ui/Input';

interface FormFieldProps {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  registration,
  type = 'text',
  placeholder,
  helperText,
  required = false,
}) => {
  return (
    <Input
      label={`${label}${required ? ' *' : ''}`}
      error={error}
      type={type}
      placeholder={placeholder}
      helperText={helperText}
      {...registration}
    />
  );
};

export default FormField;