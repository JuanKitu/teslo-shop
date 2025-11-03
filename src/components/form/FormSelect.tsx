'use client';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import AlertText from './AlertText';
import React from 'react';

interface SelectProps<T> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
  classNameSelect?: string;
  options: T[];
  getOptionValue: (opt: T) => string;
  getOptionLabel: (opt: T) => string;
}

export function FormSelect<T>({
  label,
  registration,
  error,
  className,
  options,
  getOptionValue,
  getOptionLabel,
  classNameSelect,
}: SelectProps<T>) {
  return (
    <div className={`flex flex-col ${className}`}>
      {error && <AlertText message={`${label} es requerido`} />}
      <label className="mb-1">{label}</label>
      <select {...registration} className={`border bg-gray-200 ${classNameSelect}`}>
        <option value="">[Seleccione]</option>
        {options.map((opt) => (
          <option key={getOptionValue(opt)} value={getOptionValue(opt)}>
            {getOptionLabel(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
