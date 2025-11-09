'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import AlertText from './AlertText';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
  autoFocus?: boolean;
  error?: FieldError;
  className?: string;
  classNameInput?: string;
  rows?: number;
}

export function FormTextArea({
  label,
  registration,
  error,
  className,
  autoFocus,
  classNameInput,
  rows,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col ${className}`}>
      {error && <AlertText message={`${label} es requerido`} />}

      <label className={isDark ? 'text-[var(--color-text)] mb-1' : 'text-gray-900 mb-1'}>
        {label}
      </label>

      <textarea
        autoFocus={autoFocus}
        {...registration}
        rows={rows}
        className={clsx(
          'rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
          classNameInput,
          {
            'bg-white text-gray-900 border-gray-300': !isDark,
            'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]': isDark,
            'border-red-500': error,
          }
        )}
      />
    </div>
  );
}
