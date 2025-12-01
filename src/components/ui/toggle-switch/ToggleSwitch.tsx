'use client';

import React from 'react';
import clsx from 'clsx';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <label
      className={clsx('inline-flex items-center', disabled && 'opacity-50 cursor-not-allowed')}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel || label}
        />
        <div
          className={clsx(
            'block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out',
            checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
            !disabled && 'cursor-pointer'
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          <div
            className={clsx(
              'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out',
              checked && 'transform translate-x-4'
            )}
          />
        </div>
      </div>
      {label && <span className="ml-3 text-sm">{label}</span>}
    </label>
  );
}
