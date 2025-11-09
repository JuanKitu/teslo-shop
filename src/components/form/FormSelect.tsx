'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import AlertText from './AlertText';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className={clsx('flex flex-col', className)}>
      {error && <AlertText message={`${label} es requerido`} />}

      <label className={clsx('mb-1', isDark ? 'text-[var(--color-text)]' : 'text-gray-900')}>
        {label}
      </label>

      <select
        {...registration}
        className={clsx(
          'rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
          classNameSelect,
          {
            'bg-white text-gray-900 border-gray-300': !isDark,
            'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]': isDark,
            'border-red-500': error,
          }
        )}
      >
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
