'use client';

import React from 'react';
import clsx from 'clsx';
import { IoSearch } from 'react-icons/io5';

interface CategoryFiltersProps {
  searchTerm: string;
  filterParent: string;
  isDark: boolean;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: string) => void;
}

export function CategoryFilters({
  searchTerm,
  filterParent,
  isDark,
  onSearchChange,
  onFilterChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
      {/* Search */}
      <div className="relative flex-grow w-full md:w-auto">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={clsx(
            'w-full max-w-sm rounded-md border pl-10 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
          )}
        />
      </div>

      {/* Filter */}
      <select
        value={filterParent}
        onChange={(e) => onFilterChange(e.target.value)}
        className={clsx(
          'rounded-md border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white'
        )}
      >
        <option value="all">Todas las categorías</option>
        <option value="main">Solo principales</option>
      </select>
    </div>
  );
}
