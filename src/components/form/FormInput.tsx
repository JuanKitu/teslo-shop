'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import AlertText from './AlertText';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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

      <input
        autoFocus={autoFocus}
        type={type}
        {...registration}
        className={clsx(
          'rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
          classNameInput,
          {
            // Color según tema
            'bg-white text-gray-900 border-gray-300': !isDark,
            'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]': isDark,
            // Error
            'border-red-500': error,
          }
        )}
      />
    </div>
  );
}
