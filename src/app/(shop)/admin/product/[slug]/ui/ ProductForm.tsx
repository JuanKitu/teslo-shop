'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { IoAlertCircle, IoAddCircleOutline, IoTrash } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { createUpdateProduct } from '@/actions';
import { FormInput, FormSelect, FormTextArea } from '@/components';
import type {
  Category,
  Gender,
  Product,
  ProductVariant,
  ProductImage as ProductWithImage,
  Size,
} from '@/interfaces';
import ImageUploader from './ImageUploader';

interface VariantInput {
  color: string;
  size: string;
  price: number;
  inStock: number;
  images?: string[];
}

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  tags: string;
  price: number;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: string[];
  variants: VariantInput[];
}

interface Props {
  product?: Partial<Product> & {
    ProductImage?: ProductWithImage[];
    variants?: (ProductVariant | VariantInput)[];
  };
  categories: Category[];
}

const genders: Gender[] = [
  { id: 'men', name: 'Hombre' },
  { id: 'women', name: 'Mujer' },
  { id: 'kid', name: 'Niño' },
  { id: 'unisex', name: 'Unisex' },
];

const validSizes = ['GENERIC', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductForm({ product = {}, categories }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    //getValues,
    control,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      title: product.title ?? '',
      slug: product.slug ?? '',
      description: product.description ?? '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags ?? ''),
      gender: (product.gender as FormInputs['gender']) ?? 'unisex',
      categoryId: product?.categoryId ?? '',
      price: product?.price,
      images: undefined,
      variants: (product.variants ?? []).map((v) => ({
        color: 'color' in v ? (v.color ?? '') : '',
        size: 'size' in v ? ((v.size as Size) ?? 'GENERIC') : 'GENERIC',
        price: Number('price' in v ? (v.price ?? 0) : 0),
        inStock: Number('stock' in v ? (v.stock ?? 0) : 0),
      })),
    },
  });

  // 🧩 Hook para manejar array de variantes dinámicamente
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

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
    if (product.id) formData.append('id', product.id);

    // Imágenes
    if (data.images) for (const file of data.images) formData.append('images', file);

    // Variantes (ya vienen completas desde RHF)
    formData.append('variants', JSON.stringify(data.variants));

    const { ok, product: updated } = await createUpdateProduct(formData);
    if (!ok) {
      setErrorMessage('No se pudo guardar el producto. Intenta nuevamente.');
      return;
    }

    router.replace(`/admin/product/${updated?.slug}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5 sm:px-0 mb-20"
    >
      {/* Información general */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Información del producto</h2>

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
        <FormSelect<Gender>
          label="Género"
          registration={register('gender', { required: 'El género es requerido' })}
          options={genders}
          getOptionValue={(c) => c.id}
          getOptionLabel={(c) => c.name}
          error={errors.gender}
          className="mb-3"
          classNameSelect="p-2 rounded-md"
        />
        <FormSelect<Category>
          label="Categoría"
          registration={register('categoryId', { required: 'La categoría es requerida' })}
          options={categories}
          getOptionValue={(c) => c.id}
          getOptionLabel={(c) => c.name}
          error={errors.categoryId}
          className="mb-3"
          classNameSelect="p-2 rounded-md"
        />

        <button
          type="submit"
          disabled={!isValid}
          className={clsx(
            'w-full py-2 rounded-md text-white font-medium mt-4 transition',
            isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          )}
        >
          Guardar producto
        </button>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-md">
            <IoAlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Imágenes + Variantes */}
      <div className="flex flex-col gap-6">
        {/* Imágenes */}
        <ImageUploader
          initialImages={product.ProductImage}
          onChange={(urls) => setValue('images', urls)} // actualiza el valor en el form
        />

        {/* Variantes */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Variantes</h2>
            <button
              type="button"
              onClick={() => append({ color: '', size: 'GENERIC', price: 0, inStock: 0 })}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <IoAddCircleOutline className="w-5 h-5" /> Agregar variante
            </button>
          </div>

          {fields.length === 0 && <p className="text-gray-500 text-sm">No hay variantes aún.</p>}
          <div className="space-y-4">
            {fields.map((field, i) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 border rounded-md bg-gray-50"
              >
                <FormInput
                  label="Color"
                  registration={register(`variants.${i}.color` as const, { required: true })}
                  classNameInput="p-2 border rounded-md"
                />

                <FormSelect
                  label="Talle"
                  registration={register(`variants.${i}.size` as const, { required: true })}
                  options={validSizes}
                  getOptionValue={(s) => s}
                  getOptionLabel={(s) => s}
                  classNameSelect="p-2 border rounded-md"
                />

                <FormInput
                  label="Precio"
                  type="number"
                  registration={register(`variants.${i}.price` as const, {
                    valueAsNumber: true,
                    required: true,
                  })}
                  classNameInput="p-2 border rounded-md"
                />

                <FormInput
                  label="Stock"
                  type="number"
                  registration={register(`variants.${i}.inStock` as const, {
                    valueAsNumber: true,
                    required: true,
                  })}
                  classNameInput="p-2 border rounded-md"
                />

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex items-center justify-center text-red-600 hover:text-red-700"
                >
                  <IoTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
