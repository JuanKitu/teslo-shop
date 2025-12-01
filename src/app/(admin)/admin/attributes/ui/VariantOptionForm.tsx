'use client';

import React from 'react';
import clsx from 'clsx';
import { IoAddCircleOutline } from 'react-icons/io5';
import { OptionType } from '@prisma/client';

interface VariantOptionFormProps {
  newOptionName: string;
  newOptionType: OptionType;
  isSubmitting: boolean;
  isDark: boolean;
  onNameChange: (name: string) => void;
  onTypeChange: (type: OptionType) => void;
  onSubmit: () => void;
}

export function VariantOptionForm({
  newOptionName,
  newOptionType,
  isSubmitting,
  isDark,
  onNameChange,
  onTypeChange,
  onSubmit,
}: VariantOptionFormProps) {
  return (
    <div>
      <h2 className={clsx('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
        Nueva Opción de Variante
      </h2>
      <div
        className={clsx(
          'p-6 rounded-lg shadow-sm space-y-4 mb-8',
          isDark ? 'bg-[#1f1f1f]' : 'bg-white'
        )}
      >
        <div>
          <label
            htmlFor="option-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre de la Opción
          </label>
          <input
            id="option-name"
            type="text"
            value={newOptionName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ej: Color, Talla, Estilo"
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
          />
        </div>
        <div>
          <label
            htmlFor="option-type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tipo de Valor
          </label>
          <select
            id="option-type"
            value={newOptionType}
            onChange={(e) => onTypeChange(e.target.value as OptionType)}
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
            )}
          >
            <option value="TEXT">Texto Simple</option>
            <option value="COLOR">Color</option>
            <option value="SIZE">Talla</option>
            <option value="SELECT">Selección</option>
            <option value="NUMBER">Número</option>
          </select>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !newOptionName.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoAddCircleOutline size={20} />
          {isSubmitting ? 'Guardando...' : 'Añadir Opción'}
        </button>
      </div>
    </div>
  );
}
