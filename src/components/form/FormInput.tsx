'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import AlertText from './AlertText';

interface Props {
  label: string;
  type?: string;
  registration: UseFormRegisterReturn;
  autoFocus?: boolean;
  error?: FieldError;
  className?: string;
  classNameInput?: string;
}

export function FormInput({
  label,
  type = 'text',
  registration,
  error,
  className,
  autoFocus,
  classNameInput,
}: Props) {
  return (
    <div className={`flex flex-col ${className}`}>
      {error && <AlertText message={`${label} es requerido`} />}

      <label className="mb-1">{label}</label>
      <input
        autoFocus={autoFocus}
        type={type}
        {...registration}
        className={clsx(`border bg-gray-200 ${classNameInput}`, { 'border-red-500': error })}
      />
    </div>
  );
}
