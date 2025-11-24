'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ImageUploader } from '../Image-uploader/ImageUploader';
import { useProductForm } from './hooks/useProductForm';
import { ProductInfoSection } from './components/ProductInfoSection';
import { VariantsSection } from './components/VariantsSection';
import { getFormStyles } from './styles';
import type { ProductFormProps } from './product-form.interface';

export function ProductForm({ product, categories, brands }: ProductFormProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { form, variantsArray, combinedImages, errorMessage, onSubmit, setValue } = useProductForm({
    product,
    categories,
    brands,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;

  const { fields, append, remove } = variantsArray;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar problemas de hidratación
  if (!mounted) {
    const styles = getFormStyles(false);
    return (
      <div className="px-5 sm:px-0">
        <div className={styles.skeleton} />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const styles = getFormStyles(isDark);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {/* Columna Izquierda: Información general */}
      <ProductInfoSection
        register={register}
        errors={errors}
        control={control} // 🆕 Pasar control para Controller
        categories={categories}
        brands={brands} // 🆕 Pasar brands
        isValid={isValid}
        errorMessage={errorMessage}
        isDark={isDark}
      />

      {/* Columna Derecha: Imágenes + Variantes */}
      <div className="flex flex-col gap-6">
        {/* Imágenes */}
        <ImageUploader
          initialImages={product?.images} // ✅ ProductImage → images
          onChange={(urls) => setValue('images', urls)}
        />

        {/* Variantes */}
        <VariantsSection
          control={control}
          register={register}
          fields={fields}
          append={append}
          remove={remove}
          combinedImages={combinedImages}
          isDark={isDark}
        />
      </div>
    </form>
  );
}
