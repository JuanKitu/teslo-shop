import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import { FormInput, FormSelect, FormTextArea } from '@/components';
import { getFormStyles } from '../styles';
import type { ProductInfoSectionProps } from '../product-form.interface';

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  register,
  errors,
  categories,
  brands,
  isValid,
  errorMessage,
  isDark,
}) => {
  const styles = getFormStyles(isDark);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Información del producto</h2>

      {/* Título */}
      <FormInput
        label="Título"
        registration={register('title', { required: 'El título es requerido' })}
        error={errors.title}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      {/* Slug */}
      <FormInput
        label="Slug"
        registration={register('slug', { required: 'El slug es requerido' })}
        error={errors.slug}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      {/* Descripción */}
      <FormTextArea
        label="Descripción"
        rows={5}
        registration={register('description', { required: 'La descripción es requerida' })}
        error={errors.description}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      {/* Tags */}
      <FormInput
        label="Tags (separados por comas)"
        registration={register('tags', { required: 'Los tags son requeridos' })}
        error={errors.tags}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      {/* Precio */}
      <FormInput
        label="Precio"
        classNameInput="p-2 rounded-md"
        className="mb-4"
        type="number"
        registration={register('price', {
          required: 'El precio es requerido',
          min: { value: 0, message: 'El precio debe ser mayor a 0' },
        })}
        error={errors.price}
      />

      {/* Categorías con Checkboxes */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">
          Categorías <span className="text-red-500">*</span>
        </label>
        <select
          {...register('categoryIds', {
            required: 'Debe seleccionar al menos una categoría',
          })}
          multiple
          className={`w-full p-2 rounded-md border ${
            errors.categoryIds ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800`}
          size={5}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryIds && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryIds.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples categorías
        </p>
      </div>

      {/* ✅ Marca - SIEMPRE VISIBLE */}
      <div className="mb-4">
        <FormSelect
          label="Marca (opcional)"
          registration={register('brandId')}
          options={[
            { id: '', name: '-- Sin marca --' },
            ...(brands || []), // ✅ Manejar brands undefined o vacío
          ]}
          getOptionValue={(b) => b.id}
          getOptionLabel={(b) => b.name}
          error={errors.brandId}
          className="mb-0"
          classNameSelect="p-2 rounded-md"
        />

        {/* ✅ Mensaje si no hay marcas disponibles */}
        {(!brands || brands.length === 0) && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>
              No hay marcas disponibles. Puedes crear una desde el panel de administración.
            </span>
          </p>
        )}

        {/* ✅ Ayuda normal si hay marcas */}
        {brands && brands.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">Asocia el producto con una marca (opcional)</p>
        )}
      </div>

      {/* Botón Submit */}
      <button type="submit" disabled={!isValid} className={styles.button.primary(isValid)}>
        Guardar producto
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.alert.error}>
          <IoAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
