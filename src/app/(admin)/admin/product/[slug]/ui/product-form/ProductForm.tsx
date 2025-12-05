'use client';

import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTheme } from 'next-themes';
import { ImageUploader } from '../Image-uploader/ImageUploader';
import { useProductForm } from './hooks/useProductForm';
import { ProductInfoSection } from './components/ProductInfoSection';
import { VariantsList } from './components/variants';
import { getFormStyles } from './styles';
import type { ProductFormProps } from './product-form.interface';

export function ProductForm({ product, categories, brands, variantOptions }: ProductFormProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { form, errorMessage, isSubmitting, onSubmit, setValue } = useProductForm({
    product,
    categories,
    brands,
    variantOptions, // Pass to hook
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;

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
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        {/* Columna Izquierda: Información general */}
        <ProductInfoSection
          register={register}
          errors={errors}
          control={control}
          categories={categories}
          brands={brands}
          isValid={isValid}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          isDark={isDark}
        />

        {/* Columna Derecha: Imágenes + Variantes */}
        <div className="flex flex-col gap-6">
          {/* Imágenes */}
          <ImageUploader
            initialImages={product?.images}
            onChange={(urls) => setValue('images', urls)}
          />

          {/* Variantes - NEW with dynamic attributes */}
          <VariantsList
            variantOptions={variantOptions}
            control={control}
            register={register}
            errors={errors}
            isDark={isDark}
          />
        </div>
      </form>
    </FormProvider>
  );
}
