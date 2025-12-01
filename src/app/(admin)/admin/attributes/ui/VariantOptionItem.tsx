'use client';

import React from 'react';
import clsx from 'clsx';
import { MdDelete } from 'react-icons/md';
import { OptionType } from '@prisma/client';
import { getIconForType, getTypeLabel } from './attributesUtils';

interface VariantOptionItemProps {
  id: string;
  name: string;
  slug: string;
  type: OptionType;
  description: string | null;
  placeholder: string | null;
  position: number;
  isRequired: boolean;
  isFilterable: boolean;
  globalValuesCount: number;
  isSelected: boolean;
  isDark: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function VariantOptionItem({
  name,
  type,
  globalValuesCount,
  isSelected,
  isDark,
  onSelect,
  onDelete,
}: VariantOptionItemProps) {
  const Icon = getIconForType(type);

  return (
    <li
      onClick={onSelect}
      className={clsx(
        'group flex items-center justify-between p-4 cursor-pointer transition-colors',
        isSelected
          ? isDark
            ? 'bg-blue-950/30 border-l-4 border-blue-500'
            : 'bg-blue-50 border-l-4 border-blue-600'
          : isDark
            ? 'hover:bg-[#2a2a2a]'
            : 'hover:bg-gray-50'
      )}
    >
      <div className="flex items-center flex-grow">
        <Icon
          className={clsx(
            'mr-3',
            isSelected
              ? isDark
                ? 'text-blue-400'
                : 'text-blue-600'
              : isDark
                ? 'text-gray-400'
                : 'text-gray-500'
          )}
          size={20}
        />
        <div>
          <span
            className={clsx(
              'font-medium',
              isSelected
                ? isDark
                  ? 'text-blue-400'
                  : 'text-blue-700'
                : isDark
                  ? 'text-white'
                  : 'text-gray-900'
            )}
          >
            {name}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getTypeLabel(type)} • {globalValuesCount} valor(es)
          </p>
        </div>
      </div>
      <div
        className={clsx(
          'flex items-center gap-1 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 lg:opacity-0 group-hover:opacity-100'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
        >
          <MdDelete size={18} />
        </button>
      </div>
    </li>
  );
}
