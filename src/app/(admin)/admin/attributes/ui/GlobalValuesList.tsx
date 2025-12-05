'use client';

import React from 'react';
import clsx from 'clsx';
import { MdDelete } from 'react-icons/md';
import { OptionType } from '@prisma/client';

interface GlobalValue {
  id: string;
  value: string;
  colorHex: string | null;
}

interface GlobalValuesListProps {
  values: GlobalValue[];
  optionType: OptionType;
  isDark: boolean;
  onDelete: (valueId: string) => void;
}

export function GlobalValuesList({ values, optionType, isDark, onDelete }: GlobalValuesListProps) {
  if (values.length === 0) {
    return (
      <p className="text-center py-4 text-gray-500 dark:text-gray-400">
        No hay valores predefinidos. Agrega algunos abajo.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {values.map((globalValue) => (
        <div
          key={globalValue.id}
          className={clsx(
            'flex items-center justify-between p-3 rounded-lg',
            isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'
          )}
        >
          <div className="flex items-center gap-4">
            {optionType === 'COLOR' && globalValue.colorHex && (
              <div
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                style={{ backgroundColor: globalValue.colorHex }}
              />
            )}
            <span className={clsx('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
              {globalValue.value}
            </span>
            {optionType === 'COLOR' && globalValue.colorHex && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {globalValue.colorHex}
              </span>
            )}
          </div>
          <button
            onClick={() => onDelete(globalValue.id)}
            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
          >
            <MdDelete size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
