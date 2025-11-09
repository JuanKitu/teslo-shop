import React from 'react';
import { IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { FormInput, FormSelect, VariantImagePicker } from '@/components';
import { getFormStyles } from '../styles';
import { SIZE_OPTIONS, DEFAULT_VARIANT } from '../product-form.constants';
import type { VariantsSectionProps, FormInputs } from '../product-form.interface';

export const VariantsSection: React.FC<VariantsSectionProps> = ({
  control,
  register,
  fields,
  append,
  remove,
  combinedImages,
  isDark,
}) => {
  const styles = getFormStyles(isDark);

  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={styles.heading}>Variantes</h2>
        <button
          type="button"
          onClick={() => append(DEFAULT_VARIANT)}
          className={styles.button.secondary}
        >
          <IoAddCircleOutline className="w-5 h-5" />
          Agregar variante
        </button>
      </div>

      {fields.length === 0 && (
        <p className={styles.emptyState}>No hay variantes aún. Agrega una para comenzar.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, i) => (
          <div key={field.id} className={styles.variantCard}>
            <FormInput
              label="Color"
              registration={register(`variants.${i}.color` as const, {
                required: 'Color requerido',
              })}
              classNameInput="p-2 border rounded-md"
            />

            <FormSelect
              label="Talle"
              registration={register(`variants.${i}.size` as const, {
                required: 'Talle requerido',
              })}
              options={SIZE_OPTIONS}
              getOptionValue={(s) => s.value}
              getOptionLabel={(s) => s.label}
              classNameSelect="p-2 border rounded-md"
            />

            <FormInput
              label="Precio"
              type="number"
              registration={register(`variants.${i}.price` as const, {
                valueAsNumber: true,
                required: 'Precio requerido',
                min: { value: 0, message: 'El precio debe ser mayor a 0' },
              })}
              classNameInput="p-2 border rounded-md"
            />

            <FormInput
              label="Stock"
              type="number"
              registration={register(`variants.${i}.inStock` as const, {
                valueAsNumber: true,
                required: 'Stock requerido',
                min: { value: 0, message: 'El stock debe ser mayor o igual a 0' },
              })}
              classNameInput="p-2 border rounded-md"
            />

            {/* ✅ Botón perfectamente alineado con label invisible */}
            <div className="flex flex-col pt-1">
              <span className="mb-1 text-sm h-5 invisible select-none">-</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className={`${styles.button.danger} h-[42px] flex items-center justify-center rounded-md border transition-all`}
                aria-label={`Eliminar variante ${i + 1}`}
                title="Eliminar variante"
              >
                <IoTrashOutline className="w-5 h-5" />
              </button>
            </div>

            {/* Componente de imágenes de variantes */}
            <div className="col-span-full mt-2">
              <VariantImagePicker<FormInputs>
                control={control}
                name={`variants.${i}.images`}
                images={combinedImages}
                multiple
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
