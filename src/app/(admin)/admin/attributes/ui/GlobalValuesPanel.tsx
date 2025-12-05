'use client';

import React from 'react';
import clsx from 'clsx';
import { OptionType } from '@prisma/client';
import { GlobalValuesList } from './GlobalValuesList';
import { GlobalValueForm } from './GlobalValueForm';
import { getTypeLabel } from './attributesUtils';

interface GlobalValue {
  id: string;
  value: string;
  colorHex: string | null;
}

interface SelectedOption {
  id: string;
  name: string;
  type: OptionType;
  globalValues: GlobalValue[];
  _count: {
    globalValues: number;
    productOptions: number;
  };
}

interface GlobalValuesPanelProps {
  selectedOption: SelectedOption | null;
  newValue: string;
  newColorHex: string;
  isAddingValue: boolean;
  isDark: boolean;
  onValueChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAddValue: () => void;
  onDeleteValue: (valueId: string) => void;
}

export function GlobalValuesPanel({
  selectedOption,
  newValue,
  newColorHex,
  isAddingValue,
  isDark,
  onValueChange,
  onColorChange,
  onAddValue,
  onDeleteValue,
}: GlobalValuesPanelProps) {
  if (!selectedOption) {
    return (
      <div
        className={clsx(
          'p-6 rounded-lg shadow-sm flex items-center justify-center h-64',
          isDark ? 'bg-[#1f1f1f]' : 'bg-white'
        )}
      >
        <p className="text-gray-500 dark:text-gray-400">
          Selecciona una opción para gestionar sus valores
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className={clsx('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            Valores para &quot;{selectedOption.name}&quot;
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getTypeLabel(selectedOption.type)} • {selectedOption._count.globalValues} valor(es) •{' '}
            {selectedOption._count.productOptions} producto(s)
          </p>
        </div>
      </div>

      <div className={clsx('p-6 rounded-lg shadow-sm', isDark ? 'bg-[#1f1f1f]' : 'bg-white')}>
        <div className="space-y-4">
          <GlobalValuesList
            values={selectedOption.globalValues}
            optionType={selectedOption.type}
            isDark={isDark}
            onDelete={onDeleteValue}
          />

          <GlobalValueForm
            value={newValue}
            colorHex={newColorHex}
            optionType={selectedOption.type}
            isSubmitting={isAddingValue}
            isDark={isDark}
            onValueChange={onValueChange}
            onColorChange={onColorChange}
            onSubmit={onAddValue}
          />
        </div>
      </div>
    </>
  );
}
