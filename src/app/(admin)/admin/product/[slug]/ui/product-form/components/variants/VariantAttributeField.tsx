'use client';

import React from 'react';
import clsx from 'clsx';
import type { VariantOptionWithValues } from '../../product-form.interface';

interface VariantAttributeFieldProps {
  option: VariantOptionWithValues;
  value: string;
  onChange: (value: string, globalValueId?: string) => void;
  isDark: boolean;
  error?: string;
}

export function VariantAttributeField({
  option,
  value,
  onChange,
  isDark,
  error,
}: VariantAttributeFieldProps) {
  const baseInputClasses = clsx(
    'w-full rounded-md border px-3 py-2 text-sm transition-all',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white text-gray-900',
    error && 'border-red-500'
  );

  // Render based on option type
  switch (option.type) {
    case 'COLOR':
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.name}
            {option.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Global values as color swatches */}
          {option.globalValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {option.globalValues.map((gv) => (
                <button
                  key={gv.id}
                  type="button"
                  onClick={() => onChange(gv.value, gv.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all',
                    value === gv.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  )}
                  title={gv.value}
                >
                  {/* Color swatch */}
                  {gv.colorHex && (
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: gv.colorHex }}
                    />
                  )}
                  <span className="text-sm">{gv.value}</span>
                </button>
              ))}
            </div>
          ) : (
            // Free text if no global values
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={option.placeholder || `Ej: Rojo, Azul`}
              className={baseInputClasses}
            />
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'SIZE':
    case 'SELECT':
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.name}
            {option.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          {option.globalValues.length > 0 ? (
            <select
              value={value}
              onChange={(e) => {
                const selectedGlobalValue = option.globalValues.find(
                  (gv) => gv.value === e.target.value
                );
                onChange(e.target.value, selectedGlobalValue?.id);
              }}
              className={baseInputClasses}
            >
              <option value="">Seleccionar {option.name}</option>
              {option.globalValues.map((gv) => (
                <option key={gv.id} value={gv.value}>
                  {gv.value}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={option.placeholder || `Ingrese ${option.name}`}
              className={baseInputClasses}
            />
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'NUMBER':
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.name}
            {option.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={option.placeholder || `0`}
            className={baseInputClasses}
            inputMode="decimal"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'TEXT':
    default:
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.name}
            {option.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>

          {option.globalValues.length > 0 ? (
            // Show as chips/buttons
            <div className="flex flex-wrap gap-2">
              {option.globalValues.map((gv) => (
                <button
                  key={gv.id}
                  type="button"
                  onClick={() => onChange(gv.value, gv.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md border text-sm transition-all',
                    value === gv.value
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  )}
                >
                  {gv.value}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={option.placeholder || `Ingrese ${option.name}`}
              className={baseInputClasses}
            />
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );
  }
}
