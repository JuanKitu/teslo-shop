'use client';

import React from 'react';
import clsx from 'clsx';
import { IoSearch } from 'react-icons/io5';
import { VariantOptionItem } from './VariantOptionItem';
import { OptionType } from '@prisma/client';

interface VariantOption {
  id: string;
  name: string;
  slug: string;
  type: OptionType;
  description: string | null;
  placeholder: string | null;
  position: number;
  isRequired: boolean;
  isFilterable: boolean;
  globalValues: Array<{
    id: string;
    value: string;
    label: string | null;
    colorHex: string | null;
    imageUrl: string | null;
    order: number;
  }>;
  _count: {
    productOptions: number;
    variantValues: number;
    globalValues: number;
  };
}

interface VariantOptionsListProps {
  options: VariantOption[];
  selectedOptionId: string | null;
  searchTerm: string;
  isDark: boolean;
  onSearch: (term: string) => void;
  onSelectOption: (option: VariantOption) => void;
  onEditOption: (option: VariantOption) => void;
  onDeleteOption: (optionId: string) => void;
}

export function VariantOptionsList({
  options,
  selectedOptionId,
  searchTerm,
  isDark,
  onSearch,
  onSelectOption,
  onEditOption,
  onDeleteOption,
}: VariantOptionsListProps) {
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className={clsx('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
        Opciones de Variante
      </h2>

      {/* Search */}
      <div className="relative w-full mb-4">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar opción..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className={clsx(
            'w-full rounded-md border pl-10 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
          )}
        />
      </div>

      {/* Options List */}
      <div className={clsx('rounded-lg shadow-sm', isDark ? 'bg-[#1f1f1f]' : 'bg-white')}>
        {filteredOptions.length === 0 ? (
          <p className="p-8 text-center text-gray-500 dark:text-gray-400">
            No hay opciones disponibles
          </p>
        ) : (
          <ul className={clsx('divide-y', isDark ? 'divide-gray-700' : 'divide-gray-200')}>
            {filteredOptions.map((option) => (
              <VariantOptionItem
                key={option.id}
                id={option.id}
                name={option.name}
                slug={option.slug}
                type={option.type}
                description={option.description}
                placeholder={option.placeholder}
                position={option.position}
                isRequired={option.isRequired}
                isFilterable={option.isFilterable}
                globalValuesCount={option._count.globalValues}
                isSelected={selectedOptionId === option.id}
                isDark={isDark}
                onSelect={() => onSelectOption(option)}
                onEdit={() => onEditOption(option)}
                onDelete={() => onDeleteOption(option.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
