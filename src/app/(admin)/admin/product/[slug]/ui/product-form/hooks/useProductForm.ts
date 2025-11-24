import { useState } from 'react';
import { useForm, useFieldArray, useWatch, SubmitHandler } from 'react-hook-form';
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

export const useProductForm = ({ product }: ProductFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

      // ✅ Mapear variantes con null safety
      variants: (product?.variants ?? []).map((variant) => ({
        color: variant.color ?? '',
        size: variant.size ?? '',
        price: variant.price ?? product?.price ?? 0,
        inStock: variant.inStock ?? 0,
        sku: variant.sku ?? '',
        images: normalizeImages(variant.images as string[] | undefined),
      })),
    },
  });

  const { control, setValue } = form;

  const variantsArray = useFieldArray({
    control,
    name: 'variants',
  });

  const watchedImages = useWatch({ control, name: 'images' });

  const combinedImages = Array.from(
    new Set([
      ...normalizeImages(product?.images as string[] | undefined),
      ...(product?.ProductImage?.map((img) => img.url) ?? []),
      ...(Array.isArray(watchedImages)
        ? watchedImages.filter((img): img is string => typeof img === 'string')
        : []),
    ])
  );

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage(null);
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

    // ✅ CategoryIds (validar que haya al menos uno)
    if (data.categoryIds && data.categoryIds.length > 0) {
      formData.append('categoryIds', JSON.stringify(data.categoryIds));
    } else {
      setErrorMessage('Debe seleccionar al menos una categoría');
      return;
    }

    // ✅ BrandId solo si tiene valor (no string vacía ni undefined)
    if (data.brandId && data.brandId.trim() !== '') {
      formData.append('brandId', data.brandId);
    }
    // Si brandId está vacío, simplemente no lo enviamos (es opcional)

    // ✅ Imágenes (pueden ser File o string)
    if (data.images && data.images.length > 0) {
      for (const file of data.images) {
        formData.append('images', file);
      }
    }

    // ✅ Variantes (validar que haya al menos una)
    if (data.variants && data.variants.length > 0) {
      formData.append('variants', JSON.stringify(data.variants));
    } else {
      setErrorMessage('Debe agregar al menos una variante');
      return;
    }

    // 🚀 Enviar al servidor
    const { ok, product: updated, message } = await createUpdateProduct(formData);

    if (!ok) {
      setErrorMessage(message || 'No se pudo guardar el producto. Intenta nuevamente.');
      return;
    }

    // ✅ Redireccionar al producto creado/actualizado
    if (updated?.slug) {
      router.replace(`/admin/product/${updated.slug}`);
    } else {
      router.replace('/admin/products');
    }
  };

  return {
    form,
    variantsArray,
    combinedImages,
    errorMessage,
    onSubmit,
    setValue,
  };
};
