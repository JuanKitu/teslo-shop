'use client';

import React from 'react';
import clsx from 'clsx';
import { IoAddCircleOutline } from 'react-icons/io5';
import { OptionType } from '@prisma/client';

interface VariantOptionFormProps {
  newOptionName: string;
  newOptionType: OptionType;
  editingId: string | null;
  isSubmitting: boolean;
  isDark: boolean;
  onNameChange: (name: string) => void;
  onTypeChange: (type: OptionType) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function VariantOptionForm({
  newOptionName,
  newOptionType,
  editingId,
  isSubmitting,
  isDark,
  onNameChange,
  onTypeChange,
  onSubmit,
  onCancel,
}: VariantOptionFormProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={clsx('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          {editingId ? 'Editar Opción' : 'Nueva Opción de Variante'}
        </h2>
        {editingId && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancelar
          </button>
        )}
      </div>
      <div
        className={clsx(
          'p-6 rounded-lg shadow-sm space-y-4 mb-8',
          isDark ? 'bg-[#1f1f1f]' : 'bg-white',
          editingId && 'ring-2 ring-blue-500'
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
          {isSubmitting ? 'Guardando...' : editingId ? 'Actualizar Opción' : 'Añadir Opción'}
        </button>
      </div>
    </div>
  );
}
