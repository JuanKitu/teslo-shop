import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import { FormInput, FormSelect, FormTextArea } from '@/components';
import { getFormStyles } from '../styles';
import { GENDERS } from '../product-form.constants';
import type { ProductInfoSectionProps } from '../product-form.interface';

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  register,
  errors,
  categories,
  isValid,
  errorMessage,
  isDark,
}) => {
  const styles = getFormStyles(isDark);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Información del producto</h2>

      <FormInput
        label="Título"
        registration={register('title', { required: 'El título es requerido' })}
        error={errors.title}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      <FormInput
        label="Slug"
        registration={register('slug', { required: 'El slug es requerido' })}
        error={errors.slug}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      <FormTextArea
        label="Descripción"
        rows={5}
        registration={register('description', { required: 'La descripción es requerida' })}
        error={errors.description}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      <FormInput
        label="Tags (separados por comas)"
        registration={register('tags', { required: 'Los tags son requeridos' })}
        error={errors.tags}
        className="mb-3"
        classNameInput="p-2 rounded-md"
      />

      <FormInput
        label="Precio"
        classNameInput="p-2 rounded-md"
        className="mb-2"
        type="number"
        registration={register('price', { required: 'El precio es requerido', min: 0 })}
        error={errors.price}
      />

      <FormSelect
        label="Género"
        registration={register('gender', { required: 'El género es requerido' })}
        options={GENDERS}
        getOptionValue={(c) => c.id}
        getOptionLabel={(c) => c.name}
        error={errors.gender}
        className="mb-3"
        classNameSelect="p-2 rounded-md"
      />

      <FormSelect
        label="Categoría"
        registration={register('categoryId', { required: 'La categoría es requerida' })}
        options={categories}
        getOptionValue={(c) => c.id}
        getOptionLabel={(c) => c.name}
        error={errors.categoryId}
        className="mb-3"
        classNameSelect="p-2 rounded-md"
      />

      <button type="submit" disabled={!isValid} className={styles.button.primary(isValid)}>
        Guardar producto
      </button>

      {errorMessage && (
        <div className={styles.alert.error}>
          <IoAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
