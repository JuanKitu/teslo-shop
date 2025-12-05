'use client';

import React from 'react';
import clsx from 'clsx';
import { IoTrashOutline } from 'react-icons/io5';
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { VariantAttributeField } from './VariantAttributeField';
import { VariantPriceStock } from './VariantPriceStock';
import type { FormInputs, VariantOptionWithValues } from '../../product-form.interface';

interface VariantCardProps {
  variantIndex: number;
  variantOptions: VariantOptionWithValues[];
  attributeValues: Array<{ optionId: string; value: string; globalValueId?: string }>;
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors?: FieldErrors<FormInputs>['variants'];
  isDark: boolean;
  onAttributeChange: (optionId: string, value: string, globalValueId?: string) => void;
  onRemove: () => void;
}

export function VariantCard({
  variantIndex,
  variantOptions,
  attributeValues,
  register,
  errors,
  isDark,
  onAttributeChange,
  onRemove,
}: VariantCardProps) {
  const cardClasses = clsx(
    'p-6 rounded-lg border-2 transition-all',
    isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'
  );

  return (
    <div className={cardClasses}>
      {/* Header with delete button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Variante #{variantIndex + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className={clsx(
            'p-2 rounded-md transition-colors',
            'hover:bg-red-50 dark:hover:bg-red-900/20',
            'text-red-600 dark:text-red-400'
          )}
          title="Eliminar variante"
        >
          <IoTrashOutline className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Attribute Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {variantOptions.map((option) => {
          const attributeValue = attributeValues.find((av) => av.optionId === option.id);
          return (
            <VariantAttributeField
              key={option.id}
              option={option}
              value={attributeValue?.value || ''}
              onChange={(value, globalValueId) =>
                onAttributeChange(option.id, value, globalValueId)
              }
              isDark={isDark}
            />
          );
        })}
      </div>

      {/* Price, Stock, SKU */}
      <VariantPriceStock
        variantIndex={variantIndex}
        register={register}
        isDark={isDark}
        errors={errors?.[variantIndex]}
      />

      {/* TODO: Variant Images Component */}
      {/* <VariantImageUploader variantIndex={variantIndex} control={control} /> */}
    </div>
  );
}
