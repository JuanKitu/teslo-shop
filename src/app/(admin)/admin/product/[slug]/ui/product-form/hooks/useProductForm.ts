import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createUpdateProduct } from '@/actions';
import type { FormInputs, ProductFormProps } from '../product-form.interface';

/**
 * Helper para normalizar imágenes a string[]
 */
const normalizeImages = (images?: string[] | Array<{ url: string }>): string[] => {
  if (!images || images.length === 0) return [];

  // Si es string[], retornar directo
  if (typeof images[0] === 'string') {
    return images as string[];
  }

  // Si es objeto[], extraer URLs
  return (images as Array<{ url: string }>).map((img) => img.url);
};

export const useProductForm = ({ product, variantOptions }: ProductFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      title: product?.title ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      tags: Array.isArray(product?.tags) ? product.tags.join(', ') : '',
      categoryIds: product?.categories?.map((pc) => pc.categoryId) ?? [],
      brandId: product?.brands?.[0]?.brandId ?? '',
      price: product?.price ?? 0,

      // ✅ Normalizar imágenes (prioriza ProductImage si existe)
      images: product?.ProductImage
        ? product.ProductImage.map((img) => img.url)
        : normalizeImages(product?.images as string[] | undefined),

      // ✅ Mapear variantes - Soporta dynamic attributes y legacy
      variants:
        (product?.variants ?? []).length > 0 && product
          ? product.variants.map((variant) => ({
              // NEW: Dynamic attributes - ensure optionId is always present
              optionValues: variant.optionValues?.length
                ? variant.optionValues.map((ov) => ({
                    optionId: ov.optionId,
                    value: ov.value,
                    globalValueId: undefined, // Global interface doesn't have this
                  }))
                : variantOptions.map((opt) => ({
                    optionId: opt.id,
                    value: '',
                    globalValueId: undefined,
                  })),

              // Legacy fields (backward compatibility)
              color: variant.color,
              size: variant.size,

              // Common fields
              price: variant.price ?? product?.price ?? 0,
              inStock: variant.inStock ?? 0,
              sku: variant.sku ?? '',
              images: normalizeImages(variant.images as string[] | undefined),
            }))
          : [], // Empty if no variants yet
    },
  });

  const { setValue } = form;

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Prevent double submission
    if (isSubmitting) {
      console.log('⏳ Already submitting, please wait...');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // ✅ Datos principales (texto simple)
      const simpleFields: Array<keyof FormInputs> = ['title', 'slug', 'description', 'tags'];
      simpleFields.forEach((key) => {
        const value = data[key];
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });

      // ✅ Precio (siempre incluir)
      formData.append('price', String(data.price));

      // ✅ ID solo si existe (modo edición)
      if (product?.id) {
        formData.append('id', product.id);
      }

      // ✅ CategoryIds
      if (data.categoryIds && data.categoryIds.length > 0) {
        formData.append('categoryIds', JSON.stringify(data.categoryIds));
      } else {
        setErrorMessage('Debe seleccionar al menos una categoría');
        setIsSubmitting(false);
        return;
      }

      // ✅ BrandId opcional
      if (data.brandId && data.brandId.trim() !== '') {
        formData.append('brandId', data.brandId);
      }

      // ✅ Imágenes (pueden ser File o string)
      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          formData.append('images', file);
        }
      }

      // ✅ Variantes (validar que haya al menos una)
      if (data.variants && data.variants.length > 0) {
        // Clean up optionValues - remove empty ones and prepare SKU
        const cleanedVariants = data.variants.map((variant) => ({
          ...variant,
          sku: variant.sku && variant.sku.trim() !== '' ? variant.sku : undefined, // Let server generate if empty
          optionValues: variant.optionValues?.filter(
            (ov) => ov.optionId && ov.value && ov.value.trim() !== ''
          ),
        }));

        formData.append('variants', JSON.stringify(cleanedVariants));
      } else {
        setErrorMessage('Debe agregar al menos una variante');
        setIsSubmitting(false);
        return;
      }

      // 🚀 Enviar al servidor
      const { ok, product: updated, message } = await createUpdateProduct(formData);

      if (!ok) {
        setErrorMessage(message || 'No se pudo guardar el producto. Intenta nuevamente.');
        setIsSubmitting(false);
        return;
      }

      // ✅ Guardado exitoso - resetear estado antes de redireccionar
      setIsSubmitting(false);

      // ✅ Redireccionar
      if (updated?.slug) {
        router.replace(`/admin/product/${updated.slug}`);
      } else {
        router.replace('/admin/products');
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      setErrorMessage('Error inesperado al guardar el producto');
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errorMessage,
    isSubmitting,
    onSubmit,
    setValue,
  };
};
