'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { IoSearch } from 'react-icons/io5';
import { useTheme } from 'next-themes';

interface ProductFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  stockFilter: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStockChange: (value: string) => void;
}

export function ProductFilters({
  searchTerm,
  categoryFilter,
  statusFilter,
  stockFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onStockChange,
}: ProductFiltersProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar hidratación con tema antes de montar
  const isDark = mounted && theme === 'dark';

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      {/* Search */}
      <div className="relative flex-grow">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={clsx(
            'w-full rounded-md border pl-10 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Todos los stocks</option>
          <option value="in-stock">En stock</option>
          <option value="low-stock">Poco stock</option>
          <option value="out-of-stock">Sin stock</option>
        </select>
      </div>
    </div>
  );
}
