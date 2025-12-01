'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { IoSearch } from 'react-icons/io5';
import { useTheme } from 'next-themes';

export function ProductFilters() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      {/* Search */}
      <div className="relative flex-grow">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Categoría</option>
          <option value="remeras">Remeras</option>
          <option value="pantalones">Pantalones</option>
          <option value="zapatos">Zapatos</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Estado</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className={clsx(
            'w-full md:w-auto rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            isDark
              ? 'border-gray-600 bg-[#1f1f1f] text-white'
              : 'border-gray-300 bg-white text-gray-900'
          )}
        >
          <option value="">Stock</option>
          <option value="in-stock">En stock</option>
          <option value="low-stock">Poco stock</option>
          <option value="out-of-stock">Sin stock</option>
        </select>
      </div>
    </div>
  );
}
