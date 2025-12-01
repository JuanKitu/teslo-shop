'use client';

import React from 'react';
import clsx from 'clsx';
import { OptionType } from '@prisma/client';

interface GlobalValueFormProps {
  value: string;
  colorHex: string;
  optionType: OptionType;
  isSubmitting: boolean;
  isDark: boolean;
  onValueChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
}

export function GlobalValueForm({
  value,
  colorHex,
  optionType,
  isSubmitting,
  isDark,
  onValueChange,
  onColorChange,
  onSubmit,
}: GlobalValueFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && optionType !== 'COLOR') {
      onSubmit();
    }
  };

  return (
    <div className={clsx('pt-4 mt-4 border-t', isDark ? 'border-gray-700' : 'border-gray-200')}>
      <h3 className={clsx('text-md font-medium mb-3', isDark ? 'text-white' : 'text-gray-900')}>
        Añadir nuevo valor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className={optionType === 'COLOR' ? 'col-span-1' : 'col-span-2'}>
          <label
            htmlFor="value-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {optionType === 'COLOR' ? 'Nombre del Color' : 'Valor'}
          </label>
          <input
            id="value-name"
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={
              optionType === 'COLOR' ? 'Ej: Azul' : optionType === 'SIZE' ? 'Ej: M' : 'Ej: Algodón'
            }
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
            onKeyDown={handleKeyDown}
          />
        </div>
        {optionType === 'COLOR' && (
          <div>
            <label
              htmlFor="color-value"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Color
            </label>
            <div className="relative">
              <input
                id="color-value"
                type="text"
                value={colorHex}
                onChange={(e) => onColorChange(e.target.value)}
                className={clsx(
                  'w-full pl-12 rounded-md border px-3 py-2 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
                )}
              />
              <input
                id="color-picker"
                type="color"
                value={colorHex}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-1 border-none rounded-md cursor-pointer"
              />
            </div>
          </div>
        )}
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !value.trim()}
          className="btn-primary h-fit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
