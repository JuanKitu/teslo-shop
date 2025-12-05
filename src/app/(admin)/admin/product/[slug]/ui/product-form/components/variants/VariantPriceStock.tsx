'use client';

import React from 'react';
import clsx from 'clsx';
import { UseFormRegister } from 'react-hook-form';
import type { FormInputs } from '../../product-form.interface';

interface VariantPriceStockProps {
  variantIndex: number;
  register: UseFormRegister<FormInputs>;
  isDark: boolean;
  errors?: {
    price?: { message?: string };
    inStock?: { message?: string };
    sku?: { message?: string };
  };
}

export function VariantPriceStock({
  variantIndex,
  register,
  isDark,
  errors,
}: VariantPriceStockProps) {
  const baseInputClasses = clsx(
    'w-full rounded-md border px-3 py-2 text-sm transition-all',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    isDark ? 'border-gray-600 bg-[#1f1f1f] text-white' : 'border-gray-300 bg-white text-gray-900'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Price */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Precio <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          {...register(`variants.${variantIndex}.price` as const, {
            valueAsNumber: true,
            required: 'Precio requerido',
            min: { value: 0, message: 'El precio debe ser mayor a 0' },
          })}
          className={clsx(baseInputClasses, errors?.price && 'border-red-500')}
          placeholder="0.00"
        />
        {errors?.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
      </div>

      {/* Stock */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Stock <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register(`variants.${variantIndex}.inStock` as const, {
            valueAsNumber: true,
            required: 'Stock requerido',
            min: { value: 0, message: 'El stock debe ser mayor o igual a 0' },
          })}
          className={clsx(baseInputClasses, errors?.inStock && 'border-red-500')}
          placeholder="0"
        />
        {errors?.inStock && <p className="text-xs text-red-500">{errors.inStock.message}</p>}
      </div>

      {/* SKU */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          SKU
          <span className="text-xs font-normal text-gray-500 ml-2">(Auto-generado)</span>
        </label>
        <input
          type="text"
          {...register(`variants.${variantIndex}.sku`)}
          className={baseInputClasses}
          placeholder="Se generará automáticamente"
          readOnly
          disabled
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          El SKU se genera automáticamente basado en los atributos
        </p>
      </div>
    </div>
  );
}
