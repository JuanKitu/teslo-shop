import { useState } from 'react';
import { useForm, useFieldArray, useWatch, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createUpdateProduct } from '@/actions';
import type { FormInputs, ProductFormProps } from '../product-form.interface';
import type { Size } from '@/interfaces';

export const useProductForm = ({ product }: ProductFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      title: product?.title ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      tags: Array.isArray(product?.tags) ? product.tags.join(', ') : (product?.tags ?? ''),
      gender: (product?.gender as FormInputs['gender']) ?? 'unisex',
      categoryId: product?.categoryId ?? '',
      price: product?.price ?? 0,
      images: product?.ProductImage?.map((image) => image.url) ?? [],
      variants: (product?.variants ?? []).map((variant) => ({
        color: 'color' in variant ? (variant.color ?? '') : '',
        size: 'size' in variant ? ((variant.size as Size) ?? 'GENERIC') : 'GENERIC',
        price: Number('price' in variant ? (variant.price ?? 0) : 0),
        inStock: Number('stock' in variant ? (variant.stock ?? 0) : 0),
        images: variant.images ?? [],
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
      ...(product?.ProductImage?.map((img) => img.url) ?? []),
      ...(Array.isArray(watchedImages) ? watchedImages : []),
    ])
  );

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage(null);
    const formData = new FormData();

    // Datos principales
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'images' && key !== 'variants' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // ID si estamos editando
    if (product?.id) formData.append('id', product.id);

    // Imágenes
    if (data.images) {
      for (const file of data.images) {
        formData.append('images', file);
      }
    }

    // Variantes
    formData.append('variants', JSON.stringify(data.variants));

    const { ok, product: updated } = await createUpdateProduct(formData);

    if (!ok) {
      setErrorMessage('No se pudo guardar el producto. Intenta nuevamente.');
      return;
    }

    router.replace(`/admin/product/${updated?.slug}`);
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
