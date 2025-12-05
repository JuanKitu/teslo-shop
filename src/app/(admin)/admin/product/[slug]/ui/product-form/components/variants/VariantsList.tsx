'use client';

import React from 'react';
import clsx from 'clsx';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Control, UseFormRegister, useFieldArray, FieldErrors, Controller } from 'react-hook-form';
import { VariantAttributeField } from './VariantAttributeField';
import { VariantPriceStock } from './VariantPriceStock';
import type { FormInputs, VariantOptionWithValues } from '../../product-form.interface';

interface VariantsListProps {
  variantOptions: VariantOptionWithValues[];
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors?: FieldErrors<FormInputs>;
  isDark: boolean;
}

export function VariantsList({
  variantOptions,
  control,
  register,
  errors,
  isDark,
}: VariantsListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleAddVariant = () => {
    const emptyVariant = {
      optionValues: variantOptions.map((opt) => ({
        optionId: opt.id,
        value: '',
        globalValueId: undefined,
      })),
      price: 0,
      inStock: 0,
      sku: '',
      images: [],
    };
    append(emptyVariant);
  };

  const cardClasses = clsx('p-6 rounded-lg shadow-sm', isDark ? 'bg-[#1f1f1f]' : 'bg-white');

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Variantes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Agrega diferentes combinaciones de atributos para tu producto
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all',
            'bg-blue-500 hover:bg-blue-600 text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <IoAddCircleOutline className="w-5 h-5" />
          <span>Agregar Variante</span>
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No hay variantes aún. Agrega una para comenzar.
          </p>
          <button
            type="button"
            onClick={handleAddVariant}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            + Crear primera variante
          </button>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, variantIndex) => (
          <div
            key={field.id}
            className={clsx(
              'p-6 rounded-lg border-2 transition-all',
              isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Variante #{variantIndex + 1}
              </h3>
              <button
                type="button"
                onClick={() => remove(variantIndex)}
                className={clsx(
                  'p-2 rounded-md transition-colors',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'text-red-600 dark:text-red-400'
                )}
                title="Eliminar variante"
              >
                Eliminar
              </button>
            </div>

            {/* Dynamic attributes with beautiful UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {variantOptions.map((option, optIndex) => (
                <Controller
                  key={option.id}
                  name={`variants.${variantIndex}.optionValues.${optIndex}`}
                  control={control}
                  defaultValue={{
                    optionId: option.id,
                    value: '',
                    globalValueId: undefined,
                  }}
                  render={({ field }) => (
                    <VariantAttributeField
                      option={option}
                      value={field.value?.value || ''}
                      onChange={(newValue, globalValueId) => {
                        field.onChange({
                          optionId: option.id,
                          value: newValue,
                          globalValueId: globalValueId,
                        });
                      }}
                      isDark={isDark}
                    />
                  )}
                />
              ))}
            </div>

            {/* Price, Stock, SKU */}
            <VariantPriceStock
              variantIndex={variantIndex}
              register={register}
              isDark={isDark}
              errors={errors?.variants?.[variantIndex]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
